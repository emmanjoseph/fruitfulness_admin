"use client"
import { useTheme } from 'next-themes'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  User, 
  Lock, 
  Palette,
  Shield,
  UserPlus,
  Sun,
  Moon,
  Monitor,
  EyeOff,
  Eye
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from 'sonner'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { addNewAdminSchema, updateEmailSchema, updatePasswordSchema } from '@/lib/schema'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { useState } from 'react'
import { addNewAdminAction, changeAdminPassword, updateAdminEmail} from '@/lib/actions'

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof addNewAdminSchema>>({
    resolver: zodResolver(addNewAdminSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "Admin"
    },
  });

  const emailUpdateForm = useForm<z.infer<typeof updateEmailSchema>>({
    resolver:zodResolver(updateEmailSchema),
     defaultValues:{
      email:""
     }
  })

  const updateForm = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof addNewAdminSchema>) {
    try {
      await toast.promise(
        addNewAdminAction(data),
        {
          loading: "Adding new admin...",
          success: "Admin added successfully!",
          error: (err) => err.message || "Failed to add new admin account",
        }
      );
      form.reset();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  }

  async function onUpdateEmail(data: z.infer<typeof updateEmailSchema>) {
    try {
      await toast.promise(
        updateAdminEmail(data),
        {
          loading: "Updating email...",
          success: "Email updated successfully!",
          error: (err) => err.message || "Failed to update email",
        }
      );
      emailUpdateForm.reset();
    } catch (error) {
      console.error("Email update error:", error);
    }
  }

  async function onUpdatePassword(data: z.infer<typeof updatePasswordSchema>) {
    try {
      await toast.promise(
        changeAdminPassword({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
        {
          loading: "Changing password...",
          success: "Password changed successfully!",
          error: (err) => err.message || "Failed to change password",
        }
      );
      updateForm.reset();
    } catch (error) {
      console.error("Password change error:", error);
    }
  }

  return (
    <div className='max-w-xl space-y-6 pb-10'>
      <div>
        <h1 className='font-bold text-2xl'>Settings</h1>
        <p className='text-muted-foreground text-sm'>Manage your account and preferences</p>
      </div>

      {/* Password Change Card */}
      <Card className="rounded-4xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <CardTitle>Profile & Security Settings</CardTitle>
          </div>
          <CardDescription>
            Manage your account information and password
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={emailUpdateForm.handleSubmit(onUpdateEmail)}>
            <Controller
               name='email'
               control={emailUpdateForm.control}
                render={({field, fieldState})=> (
                  <Field data-invalid={fieldState.invalid} className='mb-4'>
                    <FieldLabel htmlFor="email">Email</FieldLabel>

                    <div className='flex items-center gap-x-3'>
                      <Input
                      {...field}
                      id="email"
                      type="email"
                      className="rounded-full h-12"
                      aria-invalid={fieldState.invalid}
                    />

                    <Button type='submit' className='rounded-3xl' disabled={fieldState.invalid}>
                      Update Email
                    </Button>
                    </div>
                    
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
            
            />
          </form>
          <form onSubmit={updateForm.handleSubmit(onUpdatePassword)} className="space-y-6">
            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                <h3 className="font-semibold">Change Password</h3>
              </div>

              <Controller
                name="currentPassword"
                control={updateForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="current-password">Current Password</FieldLabel>
                    <div className="flex items-center gap-x-1.5">
                      <Input
                        {...field}
                        id="current-password"
                        type={showCurrentPassword ? "text" : "password"}
                        className="rounded-full h-12"
                        aria-invalid={fieldState.invalid}
                      />
                      <Button 
                        type="button" 
                        variant={'ghost'} 
                        size={'icon-lg'} 
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <Eye /> : <EyeOff className="opacity-50" />}
                      </Button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <Controller
                  name="newPassword"
                  control={updateForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="new-password">New Password</FieldLabel>
                      <div className="flex items-center gap-x-1.5">
                        <Input
                          {...field}
                          id="new-password"
                          type={showNewPassword ? "text" : "password"}
                          className="rounded-full h-12"
                          aria-invalid={fieldState.invalid}
                        />
                        <Button 
                          type="button" 
                          variant={'ghost'} 
                          size={'icon-lg'} 
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <Eye /> : <EyeOff className="opacity-50" />}
                        </Button>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="confirmPassword"
                  control={updateForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                      <div className="flex items-center gap-x-1.5">
                        <Input
                          {...field}
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          className="rounded-full h-12"
                          aria-invalid={fieldState.invalid}
                        />
                        <Button 
                          type="button" 
                          variant={'ghost'} 
                          size={'icon-lg'} 
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <Eye /> : <EyeOff className="opacity-50" />}
                        </Button>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </div>

            <Button type="submit" className="rounded-full h-12 font-semibold w-full">
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Add Admin Card */}
      <Card className="rounded-4xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            <CardTitle>Add New Admin</CardTitle>
          </div>
          <CardDescription>Create a new admin account for your team</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              <Controller
                name='email'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="admin-email">
                      Email address
                    </FieldLabel>
                    <Input
                      {...field}
                      id="admin-email"
                      aria-invalid={fieldState.invalid}
                      placeholder="admin@example.com"
                      autoComplete="off"
                      className="rounded-full h-12"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name='password'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="admin-password">
                      Password
                    </FieldLabel>

                    <div className="flex items-center gap-x-1.5">
                      <Input
                        {...field}
                        id="admin-password"
                        type={showPassword ? "text" : "password"}
                        aria-invalid={fieldState.invalid}
                        placeholder="••••••••"
                        autoComplete="off"
                        className="rounded-full h-12"
                      />

                      <Button type="button" variant={'ghost'} size={'icon-lg'} onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <Eye /> : <EyeOff className="opacity-50" />}
                      </Button>
                    </div>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name='role'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="admin-role">
                      Role
                    </FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="rounded-full h-12">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Super Admin">Super Admin</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Role Permissions:</Label>
              <div className="p-3 bg-accent/50 rounded-full space-y-1 text-xs">
                <p><strong>Super Admin:</strong> Full access to all features</p>
                <p><strong>Admin:</strong> Manage bookings, journeys, and view analytics</p>
              </div>
            </div>

            <Button type="submit" className="rounded-full h-12 w-full">
              Add New Admin
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="rounded-3xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            <CardTitle>Appearance</CardTitle>
          </div>
          <CardDescription>Customize how your dashboard looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="rounded-full h-12">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent className="rounded-full">
                <SelectItem value="light" className="rounded-xl">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    <span>Light</span>
                  </div>
                </SelectItem>
                <SelectItem value="dark" className="rounded-xl">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    <span>Dark</span>
                  </div>
                </SelectItem>
                <SelectItem value="system" className="rounded-xl">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    <span>System</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="rounded-3xl border-red-200 dark:border-red-900">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
          </div>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center flex-col lg:flex-row gap-2 justify-between p-4 border border-red-200 dark:border-red-900 rounded-full">
            <div>
              <h4 className="font-semibold text-sm">Delete Account</h4>
              <p className="text-sm text-muted-foreground">Permanently delete your admin account</p>
            </div>
            <Button variant="destructive" className="rounded-full">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Settings