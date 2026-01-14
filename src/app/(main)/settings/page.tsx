'use client';

import { useAuth } from '@/contexts/auth-context';
import { useData } from '@/contexts/data-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Card3D from '@/components/shared/card-3d';
import { UserCircle, Trash2, Loader2, Palette, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from '@/contexts/theme-context';
import { useRef } from 'react';

const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  avatar: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { clearAllData } = useData();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.avatar || '',
    },
  });

  function onProfileSubmit(data: ProfileFormValues) {
    if (user?.email) {
      updateUser(user.email, { name: data.name, email: data.email, avatar: data.avatar });
      toast({ title: 'Profile updated successfully!' });
    }
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        form.setValue('avatar', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearData = (dataType: 'transactions' | 'budgets' | 'goals') => {
    clearAllData(dataType);
    toast({ title: `${dataType.charAt(0).toUpperCase() + dataType.slice(1)} cleared!`, variant: 'destructive'});
  };

  return (
    <div className="space-y-8">
      <Card3D>
        <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur-xl">
          <h3 className="mb-6 flex items-center gap-2 text-xl font-bold">
            <UserCircle className="h-6 w-6 text-primary" />
            Profile Settings
          </h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onProfileSubmit)} className="space-y-6">
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                <div className='relative'>
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={form.watch('avatar') || user?.avatar} alt={user?.name} />
                    <AvatarFallback className="text-3xl">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button type="button" size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4" />
                  </Button>
                  <FormField
                    control={form.control}
                    name="avatar"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            type="file" 
                            className="hidden" 
                            ref={fileInputRef}
                            accept="image/png, image/jpeg, image/gif"
                            onChange={handleAvatarUpload} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex-1 w-full space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

               <div className="flex items-center gap-4">
                <Button type="submit" disabled={form.formState.isSubmitting} className="w-full font-bold">
                    {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
                </Button>
               </div>
            </form>
          </Form>
        </div>
      </Card3D>
      
      <Card3D>
        <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur-xl">
          <h3 className="mb-6 flex items-center gap-2 text-xl font-bold">
            <Palette className="h-6 w-6 text-primary" />
            Appearance
          </h3>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <h4 className="font-semibold">Theme</h4>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark mode.
              </p>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>
        </div>
      </Card3D>

      <Card3D>
        <div className="rounded-2xl border border-destructive/50 bg-card/80 p-6 shadow-lg backdrop-blur-xl">
          <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-destructive">
            <Trash2 className="h-6 w-6" />
            Data Management
          </h3>
          <p className="mb-6 text-sm text-muted-foreground">
            Permanently delete your application data. This action cannot be undone.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">Clear Transactions</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your transaction data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleClearData('transactions')} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">Clear Budgets</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your budget data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleClearData('budgets')} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">Clear Goals</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your savings goal data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleClearData('goals')} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </Card3D>
    </div>
  );
}
