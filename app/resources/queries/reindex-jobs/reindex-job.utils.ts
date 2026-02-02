import { ReindexJobFormValue } from './reindex-job.schema'
import { ReIndexFormData, ReIndexJobType } from './reindex-job.type'

/**
 * Convert reindex job API data to form values
 */
export function reindexJobToFormValues(reindexJob: ReIndexJobType): ReindexJobFormValue {
  return {
    domains: reindexJob.domains || [],
    entity_types: reindexJob.entity_types || [],
    updated_after: reindexJob.updated_after || '',
    updated_before: reindexJob.updated_before || '',
  }
}

/**
 * Convert form values to reindex job API data
 */
export function formValuesToReindexJobData(formValues: ReindexJobFormValue): ReIndexFormData {
  return {
    domains: formValues.domains || [],
    entity_types: formValues.entity_types || [],
    updated_after: formValues.updated_after,
    updated_before: formValues.updated_before,
  }
}
