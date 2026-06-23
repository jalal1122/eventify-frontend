"use client";

import { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { EventFormValues } from "../schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2, Copy, AlertCircle, Link as LinkIcon, FileText } from "lucide-react";

// Sortable Question Card Component
function SortableQuestionCard({ id, index, remove, duplicate }: { id: string; index: number; remove: (idx: number) => void; duplicate: (idx: number) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const { control, watch } = useFormContext<EventFormValues>();
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const questionType = watch(\`customQuestions.\${index}.type\`);

  return (
    <div ref={setNodeRef} style={style} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex gap-4 items-start group">
      {/* Drag Handle */}
      <div {...attributes} {...listeners} className="mt-2 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
        <GripVertical className="w-5 h-5" />
      </div>

      <div className="flex-1 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Question Label Input */}
          <div className="flex-1">
            <FormField
              control={control}
              name={\`customQuestions.\${index}.label\`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Type your question here" {...field} className="h-11 bg-gray-50 border-transparent focus:border-[#006782] focus:bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Question Type Select */}
          <div className="w-full md:w-48">
            <FormField
              control={control}
              name={\`customQuestions.\${index}.type\`}
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SHORT_ANSWER">Short Answer</SelectItem>
                      <SelectItem value="LONG_ANSWER">Long Answer</SelectItem>
                      <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
                      <SelectItem value="FILE_UPLOAD">File Upload</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Dynamic Options for Multiple Choice */}
        {questionType === "MULTIPLE_CHOICE" && (
           <div className="pl-2 border-l-2 border-[#006782] space-y-2 mt-2">
             <p className="text-xs text-gray-500 mb-2">Options would go here. (Simplified for this demo)</p>
             <Button variant="outline" size="sm" type="button" className="text-xs h-7 text-[#006782] border-[#006782]">
               + Add Option
             </Button>
           </div>
        )}

        <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-6">
           <FormField
              control={control}
              name={\`customQuestions.\${index}.required\`}
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormLabel className="text-sm font-medium text-gray-600">Required</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-[#006782]" />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="w-px h-4 bg-gray-200" />
            <button type="button" onClick={() => duplicate(index)} className="text-gray-400 hover:text-[#006782] transition-colors" title="Duplicate">
              <Copy className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => remove(index)} className="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
        </div>
      </div>
    </div>
  );
}


export default function StepRegistration() {
  const { control, watch, setValue } = useFormContext<EventFormValues>();
  const registrationMethod = watch("registrationMethod");
  
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  
  // Field Array for dynamic questions
  const { fields, append, remove, move, insert } = useFieldArray({
    control,
    name: "customQuestions",
  });

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      move(oldIndex, newIndex);
    }
  };

  const handleMethodClick = (method: "INTERNAL" | "EXTERNAL") => {
    if (method === "EXTERNAL" && registrationMethod !== "EXTERNAL") {
      setWarningModalOpen(true);
    } else {
      setValue("registrationMethod", method, { shouldValidate: true });
    }
  };

  const confirmExternal = () => {
    setValue("registrationMethod", "EXTERNAL", { shouldValidate: true });
    setWarningModalOpen(false);
  };

  const addNewQuestion = () => {
    append({
      id: crypto.randomUUID(),
      type: "SHORT_ANSWER",
      label: "",
      required: false,
    });
  };

  const duplicateQuestion = (index: number) => {
    const questionToDup = fields[index];
    insert(index + 1, {
      ...questionToDup,
      id: crypto.randomUUID(), // new unique id
    });
  };

  return (
    <div className="space-y-10 max-w-3xl">
      <section>
        <h2 className="text-2xl font-semibold text-[#001F29] mb-2">Registration Method</h2>
        <p className="text-gray-500 mb-6">Choose how attendees will register for your event.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Eventify Form Option */}
          <div 
            onClick={() => handleMethodClick("INTERNAL")}
            className={\`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 \${
              registrationMethod === "INTERNAL" 
              ? "border-[#006782] bg-[#F0F8FA]" 
              : "border-gray-200 bg-white hover:border-gray-300"
            }\`}
          >
            <div className={\`p-2 rounded-lg \${registrationMethod === "INTERNAL" ? "bg-[#006782] text-white" : "bg-gray-100 text-gray-500"}\`}>
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className={\`font-bold \${registrationMethod === "INTERNAL" ? "text-[#006782]" : "text-gray-700"}\`}>Eventify Form</h3>
              <p className="text-xs text-gray-500 mt-1">Use our built-in form builder, ticketing, and attendee analytics.</p>
            </div>
            <div className="ml-auto mt-1">
              <div className={\`w-5 h-5 rounded-full border-2 flex items-center justify-center \${registrationMethod === "INTERNAL" ? "border-[#006782]" : "border-gray-300"}\`}>
                {registrationMethod === "INTERNAL" && <div className="w-2.5 h-2.5 rounded-full bg-[#006782]" />}
              </div>
            </div>
          </div>

          {/* External Link Option */}
          <div 
            onClick={() => handleMethodClick("EXTERNAL")}
            className={\`p-5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 \${
              registrationMethod === "EXTERNAL" 
              ? "border-[#006782] bg-[#F0F8FA]" 
              : "border-gray-200 bg-white hover:border-gray-300"
            }\`}
          >
            <div className={\`p-2 rounded-lg \${registrationMethod === "EXTERNAL" ? "bg-[#006782] text-white" : "bg-gray-100 text-gray-500"}\`}>
              <LinkIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className={\`font-bold \${registrationMethod === "EXTERNAL" ? "text-[#006782]" : "text-gray-700"}\`}>External Link</h3>
              <p className="text-xs text-gray-500 mt-1">Redirect users to another platform like Eventbrite or Google Forms.</p>
            </div>
            <div className="ml-auto mt-1">
              <div className={\`w-5 h-5 rounded-full border-2 flex items-center justify-center \${registrationMethod === "EXTERNAL" ? "border-[#006782]" : "border-gray-300"}\`}>
                {registrationMethod === "EXTERNAL" && <div className="w-2.5 h-2.5 rounded-full bg-[#006782]" />}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conditional Content based on method */}
      {registrationMethod === "EXTERNAL" ? (
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex gap-3 text-orange-800">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Feature Limitations</h4>
                <p className="text-xs mt-1 opacity-90">By using an external link, you will not have access to Eventify's ticketing system, check-in app, or detailed attendee analytics.</p>
              </div>
           </div>

           <FormField
            control={control}
            name="externalUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#001F29] font-semibold">External Registration URL *</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/register" {...field} className="h-12 border-gray-300 rounded-xl focus-visible:ring-[#006782]" />
                </FormControl>
                <FormDescription>Attendees will be sent to this link when they click "Register".</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>
      ) : (
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-xl font-semibold text-[#001F29] mb-1">Form Builder</h2>
              <p className="text-sm text-gray-500">Customize the questions attendees must answer.</p>
            </div>
            <Button type="button" onClick={addNewQuestion} className="bg-[#006782] hover:bg-[#004E63] text-white h-10 px-4 rounded-lg">
              <Plus className="w-4 h-4 mr-2" /> Add Question
            </Button>
          </div>

          <div className="bg-slate-50 border border-gray-200 p-4 rounded-xl mb-4 opacity-70">
            <p className="text-sm font-medium text-gray-600 mb-1 flex items-center"><AlertCircle className="w-4 h-4 mr-2" /> Standard Information (Always Included)</p>
            <p className="text-xs text-gray-500 ml-6">First Name, Last Name, and Email Address are automatically collected for all attendees.</p>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <SortableQuestionCard 
                    key={field.id} 
                    id={field.id} 
                    index={index} 
                    remove={remove} 
                    duplicate={duplicateQuestion}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {fields.length === 0 && (
             <div className="text-center p-12 border-2 border-dashed border-gray-200 rounded-xl bg-slate-50">
                <p className="text-gray-400 font-medium mb-4">No custom questions added.</p>
                <Button type="button" variant="outline" onClick={addNewQuestion} className="border-[#006782] text-[#006782]">
                  Add your first question
                </Button>
             </div>
          )}
        </section>
      )}

      {/* Warning Modal */}
      <Dialog open={warningModalOpen} onOpenChange={setWarningModalOpen}>
        <DialogContent className="max-w-md bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#001F29]">Use an External Link?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 text-sm leading-relaxed">
              If you switch to an external link, you will <strong>skip the Tickets step</strong> and lose access to:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1 text-sm text-gray-600">
              <li>Built-in ticket scanning & check-in</li>
              <li>Attendee data & analytics dashboard</li>
              <li>Automated reminder emails</li>
            </ul>
          </div>
          <DialogFooter className="flex gap-3 sm:justify-between">
            <Button type="button" variant="outline" onClick={() => setWarningModalOpen(false)} className="border-gray-200">
              Cancel & Keep Eventify
            </Button>
            <Button type="button" onClick={confirmExternal} className="bg-orange-500 hover:bg-orange-600 text-white">
              Use External Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
