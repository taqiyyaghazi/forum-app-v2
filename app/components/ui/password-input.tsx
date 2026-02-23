import { Eye, EyeOff } from 'lucide-react';
import * as React from 'react';
import { cn } from '~/lib/utils';
import { Button } from './button';
import { Input } from './input';


function PasswordInput({ className, ...props }: React.ComponentProps<'input'>) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        className={cn('pr-10', className)}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShowPassword(!showPassword)}
        disabled={props.disabled}
      >
        {showPassword ? (
          <EyeOff
            className="h-4 w-4 text-gray-500 hover:text-gray-700"
            aria-hidden="true"
          />
        ) : (
          <Eye
            className="h-4 w-4 text-gray-500 hover:text-gray-700"
            aria-hidden="true"
          />
        )}
        <span className="sr-only">
          {showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
        </span>
      </Button>
    </div>
  );
}

export { PasswordInput };
