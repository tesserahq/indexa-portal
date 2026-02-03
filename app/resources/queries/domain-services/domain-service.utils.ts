import { DomainServiceFormValue } from './domain-service.schema'
import { DomainServiceFormData, DomainServiceType } from './domain-service.type'

/**
 * Convert domain service API data to form values
 */
export function domainServiceToFormValues(
  domainService: DomainServiceType
): DomainServiceFormValue {
  return {
    name: domainService.name || '',
    domains: domainService.domains || [],
    base_url: domainService.base_url || '',
    indexes_path_prefix: domainService.indexes_path_prefix || '',
    excluded_entities: domainService.excluded_entities || [],
    enabled: Boolean(domainService.enabled),
  }
}

/**
 * Convert form values to domain service API data
 */
export function formValuesToDomainServiceData(
  formValues: DomainServiceFormValue
): DomainServiceFormData {
  return {
    name: formValues.name,
    domains: formValues.domains || [],
    base_url: formValues.base_url,
    indexes_path_prefix: formValues.indexes_path_prefix,
    excluded_entities: formValues.excluded_entities || [],
    enabled: formValues.enabled,
  }
}
