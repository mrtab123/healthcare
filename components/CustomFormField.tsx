
import { E164Number } from "libphonenumber-js/core";
import {

  FormControl,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Control } from "react-hook-form"
import { FormFieldType } from "./forms/LoginForm"
import { Input } from "./ui/input";
import Image from "next/image";
import PhoneInput from "react-phone-number-input";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectTrigger } from "./ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";


interface CustomProps{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderSkeleton?: (field: any) => React.ReactNode;
  fieldType: FormFieldType;
}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const RenderField = ({field, props}: {field: any; props: CustomProps }) => {
    const { fieldType, iconSrc, iconAlt, placeholder, showTimeSelect, dateFormat, renderSkeleton } = props;

    switch (fieldType) {
      case FormFieldType.INPUT:
        return(

          <div className="flex rounded border focus-within:ring-2 focus-within:ring-blue-300 focus-within:border-blue-300">
              {props.iconSrc && (
                <Image 
                src={iconSrc || '/default-icon.svg'}
                height={24}
                width={24}
                alt={iconAlt || 'icon'}
                className="ml-2"
                />
               )}

              <FormControl>
                <Input
                  placeholder={placeholder}
                  {...field}
                  className="shad-input border-0"
                  />
              </FormControl>

          </div>
            );
            
            case FormFieldType.PASSWORD:
              return(
      
                <div className="flex rounded-md border focus-within:ring-2 focus-within:ring-blue-300 focus-within:border-blue-300">
                    {props.iconSrc && (
                      <Image 
                      src={iconSrc || '/default-icon.svg'}
                      height={24}
                      width={24}
                      alt={iconAlt || 'icon'}
                      className="ml-2"
                      />
                     )}
      
                    <FormControl>
                      <Input
                       type="password"
                        placeholder={placeholder}
                        {...field}
                        className="shad-input border-0"
                        />
                    </FormControl>
      
                </div>
                  );

      case FormFieldType.TEXTAREA:
          return (
            <FormControl>
              <Textarea
                placeholder={placeholder!}
                {...field}
                className="shad-textArea focus-within:ring-2 focus-within:ring-blue-300 focus-within:border-blue-300"
                disabled={props.disabled}
              />
            </FormControl>
          );      
        
    
      case FormFieldType.PHONE_INPUT:
        return (
          <FormControl>
            <PhoneInput
            defaultCountry="PH"
            placeholder={placeholder}
            withCountryCallingCode
            international
            value={field.value as E164Number | undefined}
            onChange={field.onChange}
            className="input-phone"
            
          />
            
          </FormControl>
        );


        case FormFieldType.DATE_PICKER:
      return (
        <div className="flex rounded border ">
          <Image
            src="/assets/icons/calendar.svg"
            height={24}
            width={24}
            alt="calendar"
            className="ml-2 "
          />
          <FormControl>
             <DatePicker 
             selected={field.value} 
             onChange={(date) => field.onChange(date)}
             dateFormat={dateFormat ?? 'MM/dd/yyyy'}
             showTimeSelect={showTimeSelect ?? false}
             timeInputLabel="Time:"
             wrapperClassName="date-picker"
              />
          </FormControl>

        </div>
      );

      case FormFieldType.SELECT:
        return (
          <FormControl >
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="shad-select-trigger">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="shad-select-content bg-white ">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
        );

         case FormFieldType.SKELETON:
          return(
            renderSkeleton ? renderSkeleton (field) : null
          )

          case FormFieldType.CHECKBOX:
            return (
              <FormControl>
                <div className="items-top flex space-x-2">
                    <Checkbox 
                      id={props.name}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <div className="grid gap-1.5 leading-none">
                    <label htmlFor="props.name" className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {props.label}
                    </label>
                    <p className="text-sm text-muted-foreground">{props.placeholder}</p>
                    </div>
                   
                </div>

                
              </FormControl>
            );   

       default:
        break;
    }
  }


const CustomFormField = (props: CustomProps) => {
  const { control, fieldType, name, label } = props;

  return (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem className="flex-1">
              {fieldType !==  FormFieldType.CHECKBOX && label && (
                <FormLabel>{label}</FormLabel>

              )}
              
              <RenderField field={field} props={props}/>
             
             <FormMessage className="shad-error" />

          </FormItem>
        )}
   />

  )
}

export default CustomFormField
