import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Patient, PatientFormData } from "@/types/patient";
import { patientFormSchema } from "@/schemas/patient.schema";
import { MESSAGES } from "@/constants/app";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PatientFormData) => void;
  patient?: Patient | null;
}

export const PatientModal = ({
  isOpen,
  onClose,
  onSave,
  patient,
}: PatientModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: patient
      ? {
          name: patient.name,
          description: patient.description,
          website: patient.website,
          avatar: patient.avatar,
        }
      : {
          name: "",
          description: "",
          website: "",
          avatar: "",
        },
  });

  // if there's a patient, reset the form with patient data
  // if there's no patient, reset the form with empty data

  useEffect(() => {
    if (!isOpen) return;
    if (patient) {
      reset({
        name: patient.name,
        description: patient.description,
        website: patient.website,
        avatar: patient.avatar,
      });
    } else {
      reset({ name: "", description: "", website: "", avatar: "" });
    }
  }, [patient, isOpen, reset]);

  const onSubmit = (data: PatientFormData) => {
    onSave(data);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {patient ? "Edit Patient" : "Add New Patient"}
          </DialogTitle>
          <DialogDescription>
            {patient
              ? "Update the patient information below."
              : "Fill in the information to add a new patient."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder={MESSAGES.PLACEHOLDER.PATIENT_NAME}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder={MESSAGES.PLACEHOLDER.PATIENT_DESCRIPTION}
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">
              Website <span className="text-destructive">*</span>
            </Label>
            <Input
              id="website"
              {...register("website")}
              placeholder={MESSAGES.PLACEHOLDER.PATIENT_WEBSITE}
            />
            {errors.website && (
              <p className="text-sm text-destructive">
                {errors.website.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">
              Avatar URL <span className="text-destructive">*</span>
            </Label>
            <Input
              id="avatar"
              {...register("avatar")}
              placeholder={MESSAGES.PLACEHOLDER.PATIENT_AVATAR}
            />
            {errors.avatar && (
              <p className="text-sm text-destructive">
                {errors.avatar.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">{patient ? "Update" : "Add"} Patient</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
