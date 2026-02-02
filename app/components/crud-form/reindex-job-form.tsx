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
  defaultReindexJobFormValues,
  reindexJobFormSchema,
  type ReindexJobFormValue,
} from '@/resources/queries/reindex-jobs'
import { Loader2, X } from 'lucide-react'
import { useState } from 'react'
import { FormLayout } from '../form/form-layout'
import { useNavigate } from 'react-router'

type ArrayBadgeFieldProps = {
  field: 'domains' | 'entity_types'
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

type ReindexJobFormProps = {
  defaultValues?: ReindexJobFormValue
  onSubmit: (values: ReindexJobFormValue) => void | Promise<void>
  isSubmitting?: boolean
  submitLabel?: string
}

export function ReindexJobForm({
  defaultValues = defaultReindexJobFormValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Save',
}: ReindexJobFormProps) {
  const navigate = useNavigate()

  return (
    <div className="pt-5">
      <Form schema={reindexJobFormSchema} defaultValues={defaultValues} onSubmit={onSubmit}>
        <FormLayout title="New Reindex Job">
          <ArrayBadgeField
            field="domains"
            label="Domains"
            placeholder="e.g., example.com"
            required
          />

          <ArrayBadgeField
            field="entity_types"
            label="Entity Types"
            placeholder="e.g., products"
            required
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Form.DateTimePicker field="updated_after" label="Updated After" required />
            <Form.DateTimePicker field="updated_before" label="Updated Before" required />
          </div>

          <div className="flex justify-end mt-10 gap-2">
            <Button type="button" variant="outline" onClick={() => navigate('/reindex-jobs')}>
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
