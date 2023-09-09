import { AuthRequestHandler } from '@/types/user.type';
import { Contact } from '@/models/Contact/Contact';
import { UpdateContactDataSchema, UpdateFavoriteSchema } from '@/models/Contact/contact.schema';
import { HttpError, handlerWrapper } from '@/helpers';

const getAll: AuthRequestHandler<
  {},
  {},
  {},
  { page: number; limit: number; favorite: boolean }
> = async (req, res) => {
  const { page = 1, limit = 5, favorite = false } = req.query;
  const skip = (page - 1) * limit;
  const contacts = await Contact.find(
    { owner: req.body.user._id, favorite },
    '-updatedAt -createdAt -owner',
    {
      skip,
      limit
    }
  );
  res.json(contacts);
};

const getById: AuthRequestHandler<{ contactId: string }> = async (req, res) => {
  const contactId = req.params.contactId;
  const contact = await Contact.findById(contactId);
  if (!contact) throw new HttpError(404, 'Not found');
  res.json(contact);
};

const post: AuthRequestHandler = async (req, res) => {
  const validatedBody = UpdateContactDataSchema.parse(req.body);
  const addedContact = await Contact.create({ ...validatedBody, owner: req.body.user._id });
  res.status(201).json(addedContact);
};

const putById: AuthRequestHandler<{ contactId: string }> = async (req, res) => {
  const contactId = req.params.contactId;
  const validatedBody = UpdateContactDataSchema.parse(req.body);
  const updatedContact = await Contact.findByIdAndUpdate(contactId, validatedBody, { new: true });
  if (!updatedContact) throw new HttpError(404, 'Not found');
  res.json(updatedContact);
};

const patchById: AuthRequestHandler<{ contactId: string }> = async (req, res) => {
  const contactId = req.params.contactId;
  const validatedBody = UpdateFavoriteSchema.parse(req.body);
  const updatedContact = await Contact.findByIdAndUpdate(contactId, validatedBody, { new: true });
  if (!updatedContact) throw new HttpError(404, 'Not found');
  res.json(updatedContact);
};

const deleteById: AuthRequestHandler<{ contactId: string }> = async (req, res) => {
  const contactId = req.params.contactId;
  const removedContact = await Contact.findByIdAndDelete(contactId);
  if (!removedContact) throw new HttpError(404, 'Not found');
  res.json({ message: 'contact deleted' });
};

export default {
  getAll: handlerWrapper(getAll),
  getById: handlerWrapper(getById),
  post: handlerWrapper(post),
  putById: handlerWrapper(putById),
  patchById: handlerWrapper(patchById),
  deleteById: handlerWrapper(deleteById)
};
