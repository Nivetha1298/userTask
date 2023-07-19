
import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { FormDao } from "../dao/formDao";
import { Connection, createConnection } from "typeorm";
import { formSchema } from "../validation/userValidation";
import { Form as IForm } from "../interfaces/Form";
import { authenticateJWT } from "../middleware/authenticateJWT";


const router = express.Router();

// Create an instance of UserDAO using the Connection object
createConnection().then((connection: Connection) => {
    const formDao = new FormDao(connection);
    
    router.post("/",authenticateJWT, async (req: Request, res: Response) => {
        try {
         const { error, value } = formSchema.validate(req.body);
         if (error) {
            return res.status(400).json({ message: 'Validation error', details: error.details });
          }
          const formData:IForm = value;
          // Save the form data to the database
          const result = await formDao.saveForm(formData);
    
          res.status(201).json({ message: "Form submitted successfully"   , result:result.id});
        } catch (error) {
          console.error("Error during form submission:", error);
          res.status(500).json({ message: "Form submission failed" });
        }
      });

      router.get("/",authenticateJWT, async (req: Request, res: Response) => {
        try {
          const page = parseInt(req.query.page as string) || 1;
          const pageSize = parseInt(req.query.pageSize as string) || 10;
          const forms = await formDao.getForms(page, pageSize);
      
          res.status(200).json({ data: forms });
        } catch (error) {
          console.error("Error while fetching forms:", error);
          res.status(500).json({ message: "Failed to fetch forms" });
        }
      });
       
      router.get('/:id', authenticateJWT, async (req: Request, res: Response) => {
        try {
          const formId = parseInt(req.params.id); // Convert the form ID to a number (assuming it's an integer)
      
          // Fetch the form from the database using the form ID
          const form = await formDao.getFormById(formId);
      
          // If the form with the given ID is not found, return a 404 response
          if (!form) {
            return res.status(404).json({ message: 'Form not found' });
          }
      
          // If the form is found, return it in the response
          res.json(form);
        } catch (error) {
          console.error('Error while fetching form:', error);
          res.status(500).json({ message: 'Failed to fetch form' });
        }
      });
    
      router.put('/:id', authenticateJWT, async (req: Request, res: Response) => {
        try {
          const formId = parseInt(req.params.id); // Convert the form ID to a number (assuming it's an integer)
      
          // Fetch the form from the database using the form ID
          const existingForm = await formDao.getFormById(formId);
      
          // If the form with the given ID is not found, return a 404 response
          if (!existingForm) {
            return res.status(404).json({ message: 'Form not found' });
          }
      
          // Update the form data with the values from the request body
          const updatedForm: IForm = {
            ...existingForm,
            ...req.body,
          };
      
          // Save the updated form data to the database
        const result =  await formDao.saveForm(updatedForm);
      
          res.json({ message: 'Form updated successfully' , result:result.id });
        } catch (error) {
          console.error('Error while updating form:', error);
          res.status(500).json({ message: 'Failed to update form' });
        }
      });

      router.delete('/:id', authenticateJWT, async (req: Request, res: Response) => {
        try {
          const formId = parseInt(req.params.id); // Convert the form ID to a number (assuming it's an integer)
      
          // Fetch the form from the database using the form ID
          const existingForm = await formDao.getFormById(formId);
      
          // If the form with the given ID is not found, return a 404 response
          if (!existingForm) {
            return res.status(404).json({ message: 'Form not found' });
          }
      
          // Delete the form from the database
         const result = await formDao.deleteForm(formId);
      
          res.json({ message: 'Form deleted successfully'  });
        } catch (error) {
          console.error('Error while deleting form:', error);
          res.status(500).json({ message: 'Failed to delete form' });
        }
      });
      
      
 
})


export const formRoutes = router;
