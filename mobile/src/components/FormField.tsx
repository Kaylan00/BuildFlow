import React from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import { TextInputProps } from 'react-native';
import { Input } from './Input';

interface Props<T extends FieldValues> extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
}

export function FormField<T extends FieldValues>({ control, name, label, ...rest }: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
        <Input
          label={label}
          value={value !== undefined && value !== null ? String(value) : ''}
          onChangeText={onChange}
          onBlur={onBlur}
          error={error?.message}
          {...rest}
        />
      )}
    />
  );
}
