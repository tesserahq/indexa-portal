// @vitest-environment node

import { describe, expect, it } from 'vitest'

import {
  defaultDomainServiceFormValues,
  domainServiceCreateSchema,
  domainServiceUpdateSchema,
} from './domain-service.schema'
import { domainServiceToFormValues, formValuesToDomainServiceData } from './domain-service.utils'

describe('domain service schemas', () => {
  it('provides defaults for a new form', () => {
    expect(defaultDomainServiceFormValues).toEqual({
      name: '',
      domains: [],
      base_url: '',
      indexes_path_prefix: '',
      excluded_entities: [],
      enabled: true,
    })
  })

  it('rejects create payloads missing required fields or domains', () => {
    expect(domainServiceCreateSchema.safeParse({}).success).toBe(false)
    expect(
      domainServiceCreateSchema.safeParse({
        name: 'Catalog',
        domains: [],
        base_url: 'https://catalog.example.com',
        indexes_path_prefix: '/indexes',
        excluded_entities: [],
        enabled: true,
      }).success
    ).toBe(false)
  })

  it('allows partial update payloads', () => {
    expect(domainServiceUpdateSchema.parse({ enabled: false })).toEqual({ enabled: false })
  })
})

describe('domain service form conversions', () => {
  it('fills missing API fields with form defaults', () => {
    expect(domainServiceToFormValues({ id: 'service-1' })).toEqual(defaultDomainServiceFormValues)
  })

  it('preserves configured domains and filters when preparing API data', () => {
    expect(
      formValuesToDomainServiceData({
        name: 'Catalog',
        domains: ['catalog.example.com'],
        base_url: 'https://catalog.example.com',
        indexes_path_prefix: '/indexes',
        excluded_entities: ['Draft'],
        enabled: false,
      })
    ).toEqual({
      name: 'Catalog',
      domains: ['catalog.example.com'],
      base_url: 'https://catalog.example.com',
      indexes_path_prefix: '/indexes',
      excluded_entities: ['Draft'],
      enabled: false,
    })
  })
})
