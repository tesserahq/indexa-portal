import { Form, useFormContext } from '@/components/form'
import { Badge } from '@/modules/shadcn/ui/badge'
import { Button } from '@/modules/shadcn/ui/button'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/shadcn/ui/form'
import { Input } from '@/modules/shadcn/ui/input'
import {
  defaultDomainServiceFormValues,
  domainServiceFormSchema,
  type DomainServiceFormValue,
} from '@/resources/queries/domain-services'
import { Loader2, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { FormLayout } from '../form/form-layout'

type ArrayBadgeFieldProps = {
  field: 'domains' | 'excluded_entities'
  label: string
  description?: string
  placeholder?: string
  required?: boolean
}

function ArrayBadgeField({
  field,
  label,
  description,
  placeholder,
  required = false,
}: ArrayBadgeFieldProps) {
  const { form } = useFormContext()
  const [inputValue, setInputValue] = useState('')

  return (
    <FormField
      control={form.control}
      name={field}
      render={({ field: fieldProps }) => {
        const items = Array.isArray(fieldProps.value) ? fieldProps.value : []

        const handleAddItem = () => {
          const trimmed = inputValue.trim()
          if (!trimmed) return

          if (!items.includes(trimmed)) {
            fieldProps.onChange([...items, trimmed])
          }

          setInputValue('')
        }

        const handleRemoveItem = (value: string) => {
          fieldProps.onChange(items.filter((item) => item !== value))
        }

        return (
          <FormItem>
            <FormLabel className="text-sm font-medium">
              {label} {required && <span className="text-xs text-red-600">*</span>}
            </FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
            <div className="flex items-center gap-2">
              <FormControl>
                <Input
                  value={inputValue}
                  placeholder={placeholder}
                  onChange={(event) => setInputValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      handleAddItem()
                    }
                  }}
                />
              </FormControl>
              <Button
                type="button"
                variant="black"
                onClick={handleAddItem}
                disabled={!inputValue.trim()}>
                Add
              </Button>
            </div>
            {items.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {items.map((item) => (
                  <Badge key={item} variant="outline" className="flex items-center gap-1">
                    {item}
                    <button
                      type="button"
                      className="cursor-pointer"
                      onClick={() => handleRemoveItem(item)}
                      aria-label={`Remove ${item}`}>
                      <X size={15} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

type DomainServiceFormProps = {
  defaultValues?: DomainServiceFormValue
  onSubmit: (values: DomainServiceFormValue) => void | Promise<void>
  isSubmitting?: boolean
  submitLabel?: string
  title?: string
  cancelPath?: string
}

export function DomainServiceForm({
  defaultValues = defaultDomainServiceFormValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Save',
  title = 'New Domain Service',
  cancelPath = '/domain-services',
}: DomainServiceFormProps) {
  const navigate = useNavigate()

  return (
    <div className="pt-5">
      <Form schema={domainServiceFormSchema} defaultValues={defaultValues} onSubmit={onSubmit}>
        <FormLayout title={title}>
          <Form.Input field="name" label="Name" placeholder="e.g., Search API" required />

          <ArrayBadgeField
            field="domains"
            label="Domains"
            placeholder="e.g., example.com"
            required
          />

          <Form.Input
            field="base_url"
            label="Base URL"
            placeholder="https://example.com"
            required
          />

          <Form.Input
            field="indexes_path_prefix"
            label="Indexes Path Prefix"
            placeholder="e.g., /indexes"
            required
          />

          <ArrayBadgeField
            field="excluded_entities"
            label="Excluded Entities"
            placeholder="e.g., orders"
          />

          <Form.Switch field="enabled" label="Enabled" />

          <div className="flex justify-end mt-10 gap-2">
            <Button type="button" variant="outline" onClick={() => navigate(cancelPath)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </div>
        </FormLayout>
      </Form>
    </div>
  )
}
