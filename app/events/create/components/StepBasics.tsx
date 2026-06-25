"use client";

import { useFormContext } from "react-hook-form";
import { EventFormValues } from "../schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ImageUploadZone from "./ImageUploadZone";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import LocationMap from "./LocationMap";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "1", name: "Music & Concerts" },
  { id: "2", name: "Technology & Innovation" },
  { id: "3", name: "Arts & Culture" },
  { id: "4", name: "Business & Networking" },
  { id: "5", name: "Food & Drink" },
];

export default function StepBasics() {
  const { control, watch } = useFormContext<EventFormValues>();
  const locationType = watch("locationType");

  return (
    <div className="space-y-12">
      {/* 1. Event Details */}
      <section>
        <h2 className="text-2xl font-semibold text-[#001F29] mb-6">1. Event Details</h2>
        <div className="space-y-6 max-w-3xl">
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#001F29] font-semibold">Event Title *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the name of your event" {...field} className="h-12 border-gray-300 rounded-xl focus-visible:ring-[#006782]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#001F29] font-semibold">Event Category *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12 border-gray-300 rounded-xl focus:ring-[#006782]">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white">
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </section>

      {/* 2. Event Banner */}
      <section>
        <h2 className="text-2xl font-semibold text-[#001F29] mb-6">2. Event Banner</h2>
        <div className="max-w-3xl">
          <ImageUploadZone />
        </div>
      </section>

      {/* 3. Location */}
      <section>
        <h2 className="text-2xl font-semibold text-[#001F29] mb-6">3. Location</h2>
        
        <FormField
          control={control}
          name="locationType"
          render={({ field }) => (
            <FormItem className="space-y-3 mb-6">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="VENUE" className="text-[#006782]" />
                    </FormControl>
                    <FormLabel className="font-medium">Venue (Physical Location)</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="ONLINE" className="text-[#006782]" />
                    </FormControl>
                    <FormLabel className="font-medium">Online Event</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col lg:flex-row gap-8 max-w-5xl">
          {locationType === "VENUE" ? (
            <>
              <div className="flex-1 space-y-6">
                <FormField
                  control={control}
                  name="venueName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#001F29] font-semibold">Venue Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Expo Center" {...field} className="h-12 border-gray-300 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#001F29] font-semibold">City</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Lahore" {...field} className="h-12 border-gray-300 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#001F29] font-semibold">Address Line 1</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 123 Main St" {...field} className="h-12 border-gray-300 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1">
                <FormLabel className="text-[#001F29] font-semibold block mb-3">Map Preview</FormLabel>
                <LocationMap />
              </div>
            </>
          ) : (
            <div className="flex-1 space-y-6 max-w-3xl">
              <FormField
                control={control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#001F29] font-semibold">Platform / Software</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Zoom, Google Meet" {...field} className="h-12 border-gray-300 rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="virtualLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#001F29] font-semibold">Virtual Link (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://" {...field} className="h-12 border-gray-300 rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
      </section>

      {/* 4. Date and Time */}
      <section>
        <h2 className="text-2xl font-semibold text-[#001F29] mb-6">4. Date and Time</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          <FormField
            control={control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-[#001F29] font-semibold">Start Date *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full h-12 pl-3 text-left font-normal border-gray-300 rounded-xl",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#001F29] font-semibold">Start Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} className="h-12 border-gray-300 rounded-xl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-[#001F29] font-semibold">End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full h-12 pl-3 text-left font-normal border-gray-300 rounded-xl",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#001F29] font-semibold">End Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} className="h-12 border-gray-300 rounded-xl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </section>

      {/* 5. Event Overview */}
      <section>
        <h2 className="text-2xl font-semibold text-[#001F29] mb-6">5. Event Overview</h2>
        <div className="max-w-3xl">
          <FormField
            control={control}
            name="overview"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#001F29] font-semibold">Description</FormLabel>
                <FormControl>
                  <RichTextEditor 
                    content={field.value || ""} 
                    onChange={field.onChange} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </section>
    </div>
  );
}


