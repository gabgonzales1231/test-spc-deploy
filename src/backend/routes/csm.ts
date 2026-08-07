import { Elysia } from 'elysia'
import { supabase } from '@/backend/config/database'
import { errorHandler } from '@/backend/utils/error'
import { throwValidationError } from '@/backend/utils/error'
import { CsmResponseSchema } from '@/backend/schemas/csm'
import { generateCsmPdf, type CsmResponseForPdf } from '@/backend/utils/csmPdfService'

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

    // Insert first (without control_no) so we get the DB-assigned serial id,
    // then derive control_no = YYYY-MM-{id, 4-digit padded} and patch it in.
    const { data: inserted, error: insertError } = await supabase
      .from('csm_response')
      .insert({
        office_id:         input.officeId,
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
      })
      .select('id, created_at, office_name')
      .single()

    if (insertError || !inserted) {
      console.error('[csm-response] insert error:', insertError)
      if (insertError?.code === '23503') {
        throwValidationError('Selected office was not found. Please reload and try again.')
      }
      throw new Error('Failed to save your response')
    }

    const created = new Date(inserted.created_at as string)
    const yyyy = created.getFullYear()
    const mm = String(created.getMonth() + 1).padStart(2, '0')
    const controlNo = `${yyyy}-${mm}-${String(inserted.id).padStart(4, '0')}`

    const { error: updateError } = await supabase
      .from('csm_response')
      .update({ control_no: controlNo })
      .eq('id', inserted.id)

    if (updateError) {
      console.error('[csm-response] control_no update error:', updateError)
      // Non-fatal to the submitter — the response was saved either way.
    }

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
      office_name:       (inserted as { office_name?: string | null }).office_name ?? null,
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
        data: { id: inserted.id, controlNo },
        message: 'Thank you for your feedback.',
        pdfError: true,
      }
    }
  })