import { Elysia } from 'elysia'
import { supabase } from '@/backend/config/database'
import { errorHandler } from '@/backend/utils/error'
import { throwValidationError } from '@/backend/utils/error'
import { CsmResponseSchema } from '@/backend/schemas/csm'
import { generateCsmPdf, type CsmResponseForPdf } from '@/backend/utils/csmPdfService'

// Shape returned by the insert_csm_response() Postgres function (mirrors the
// csm_response table). Supabase's .rpc() has no generated return type here,
// so this gives us type safety on `inserted` instead of scattered `as` casts.
type CsmResponseRow = {
  id: number
  control_no: string
  office_name: string | null
}

export const csmRoutes = new Elysia({ prefix: '/csm-response' })
  .use(errorHandler)

  .post('/', async ({ body, set }) => {
    const parsed = CsmResponseSchema.safeParse(body)
    if (!parsed.success) {
      throwValidationError('Invalid CSM submission', parsed.error.flatten())
    }
    // Narrow for TS — throwValidationError always throws, but TS can't see that.
    if (!parsed.success) throw new Error('unreachable')
    const input = parsed.data


    // Insert + control_no assignment happens atomically in a single Postgres
    // function (insert_csm_response), which locks the offices row for the
    // duration of the transaction. That serializes concurrent submissions
    // for the same office, so the per-office sequential count used in the
    // control_no can never be read twice before either insert commits —
    // eliminating the race condition a separate count-then-update in app
    // code would have.
    const { data: inserted, error: insertError } = await supabase
      .rpc('insert_csm_response', {
        p_office_id:        input.officeId,
        p_client_type:      input.clientType,
        p_transaction_date: input.transactionDate,
        p_sex:               input.sex ?? null,
        p_age:               input.age ?? null,
        p_region:            input.region,
        p_service:           input.service,
        p_cc1:               input.cc1,
        p_cc2:               input.cc2,
        p_cc3:               input.cc3,
        p_sqd0:              input.sqd0,
        p_sqd1:              input.sqd1,
        p_sqd2:              input.sqd2,
        p_sqd3:              input.sqd3,
        p_sqd4:              input.sqd4,
        p_sqd5:              input.sqd5,
        p_sqd6:              input.sqd6,
        p_sqd7:              input.sqd7,
        p_sqd8:              input.sqd8,
        p_comments:          input.comments || null,
        p_email_address:     input.emailAddress || null,
      })
      .single()

    if (insertError || !inserted) {
      console.error('[csm-response] insert error:', insertError)
      if (insertError?.code === 'P0002' || insertError?.code === '23503') {
        throwValidationError('Selected office was not found. Please reload and try again.')
      }
      throw new Error('Failed to save your response')
    }

    // Cast once here — Supabase's .rpc() has no generated return type for
    // this function, so `inserted` comes back as `{}` from TS's point of
    // view even though it's a real csm_response row at runtime.
    const row = inserted as CsmResponseRow

    const controlNo = row.control_no

    // Build the row shape the PDF service expects (snake_case, matching csm_response
    // columns) from the already-validated camelCase input, rather than re-fetching.
    const pdfRow: CsmResponseForPdf = {
      control_no:       controlNo,
      client_type:      input.clientType,
      transaction_date: input.transactionDate,
      sex:               input.sex ?? null,
      age:               input.age ?? null,
      region:            input.region,
      service:           input.service,
      cc1:               input.cc1,
      cc2:               input.cc2,
      cc3:               input.cc3,
      sqd0:              input.sqd0,
      sqd1:              input.sqd1,
      sqd2:              input.sqd2,
      sqd3:              input.sqd3,
      sqd4:              input.sqd4,
      sqd5:              input.sqd5,
      sqd6:              input.sqd6,
      sqd7:              input.sqd7,
      sqd8:              input.sqd8,
      comments:          input.comments || null,
      email_address:     input.emailAddress || null,
      office_name:       row.office_name ?? null,
    }

    try {
      const pdfBytes = await generateCsmPdf(pdfRow)
      const pdfBuffer = Buffer.from(pdfBytes)
      set.headers['Content-Type'] = 'application/pdf'
      set.headers['Content-Disposition'] = `attachment; filename="CSM-${controlNo}.pdf"`
      return new Response(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="CSM-${controlNo}.pdf"`,
        },
      })
    } catch (pdfError) {
      // The response was already saved successfully — don't fail the whole
      // submission just because the PDF couldn't be generated. Let the
      // frontend fall back to a "submitted, but download failed" state.
      console.error('[csm-response] PDF generation error:', pdfError)
      return {
        success: true,
        data: { id: row.id, controlNo },
        message: 'Thank you for your feedback.',
        pdfError: true,
      }
    }
  })