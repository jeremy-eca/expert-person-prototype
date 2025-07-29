import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "../../lib/utils"
import { Button } from "./button"
import { Input } from "./input"

interface ComboboxProps {
  value?: string
  onValueChange?: (value: string) => void
  searchValue?: string
  onSearchChange?: (value: string) => void
  placeholder?: string
  className?: string
  children: React.ReactNode
}

const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
  ({ 
    value, 
    onValueChange, 
    searchValue = "", 
    onSearchChange, 
    placeholder = "Select option...", 
    className,
    children
  }, ref) => {
    const [open, setOpen] = React.useState(false)
    const [internalSearch, setInternalSearch] = React.useState("")
    
    const searchText = searchValue || internalSearch
    const handleSearchChange = onSearchChange || setInternalSearch

    // Get the display value for the selected option
    const getDisplayValue = () => {
      if (!value) return placeholder
      
      // Try to find the display text from children
      const findDisplayText = (children: React.ReactNode): string | null => {
        if (React.isValidElement(children)) {
          if (children.props.value === value) {
            return children.props.children || value
          }
          if (children.props.children) {
            const result = findDisplayText(children.props.children)
            if (result) return result
          }
        }
        if (Array.isArray(children)) {
          for (const child of children) {
            const result = findDisplayText(child)
            if (result) return result
          }
        }
        return null
      }

      return findDisplayText(children) || value
    }

    const handleSelect = (selectedValue: string) => {
      onValueChange?.(selectedValue === value ? "" : selectedValue)
      setOpen(false)
    }

    return (
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              !value && "text-muted-foreground",
              className
            )}
          >
            <span className="truncate">{getDisplayValue()}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            className="w-[var(--radix-popover-trigger-width)] p-0 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
            align="start"
          >
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Input
                placeholder="Search..."
                value={searchText}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <div className="max-h-[300px] overflow-auto p-1">
              {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                  const childValue = child.props.value
                  const isSelected = value === childValue
                  
                  return (
                    <div
                      key={childValue}
                      className={cn(
                        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                        isSelected && "bg-accent text-accent-foreground"
                      )}
                      onClick={() => handleSelect(childValue)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {child.props.children}
                    </div>
                  )
                }
                return child
              })}
              {React.Children.count(children) === 0 && (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No options found.
                </div>
              )}
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    )
  }
)

Combobox.displayName = "Combobox"

export { Combobox }