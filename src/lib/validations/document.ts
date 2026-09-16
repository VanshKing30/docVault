import { z } from "zod";

export const documentTypes = [
  "Aadhaar Card",
  "PAN Card",
  "Passport",
  "Driving Licence",
  "Birth Certificate",
  "Voter ID",
  "Other",
] as const;
export const documentUploadSchema = z.object({
  
    docType: z.enum(documentTypes, {
        error : "Please select a valid document type",
    }),
  expiryDate: z
    .string()
    .optional()
    .refine(
        (value) => !value || !Number.isNaN(Date.parse(value)),
        "Please enter a valid expriy date",
    ),
});