import { Request, Response } from 'express';
import { WebsiteContent } from '../../models/WebsiteContent.js';
import { Community } from '../../models/Community.js';
import { Developer } from '../../models/Developer.js';
import { Location } from '../../models/Location.js';
import { AuthenticatedRequest } from '../../middleware/authenticate.js';

export async function handleGetWebsiteContent(req: Request, res: Response): Promise<void> {
  try {
    let content = await WebsiteContent.findOne();
    if (!content) {
      content = await WebsiteContent.create({});
    }
    res.json({ success: true, content });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function handleUpdateWebsiteContent(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    let content = await WebsiteContent.findOne();
    if (!content) {
      content = await WebsiteContent.create(req.body);
    } else {
      Object.assign(content, req.body);
      await content.save();
    }
    res.json({ success: true, message: 'Website CMS content updated successfully', content });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function handleGetCommunities(req: Request, res: Response): Promise<void> {
  try {
    const communities = await Community.find().sort({ isFeatured: -1, name: 1 });
    res.json({ success: true, communities });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function handleGetCommunityBySlug(req: Request, res: Response): Promise<void> {
  try {
    const { slug } = req.params;
    const community = await Community.findOne({ slug });
    if (!community) {
      res.status(404).json({ success: false, message: 'Community not found' });
      return;
    }
    res.json({ success: true, community });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function handleGetDevelopers(req: Request, res: Response): Promise<void> {
  try {
    const developers = await Developer.find().sort({ name: 1 });
    res.json({ success: true, developers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function handleGetDeveloperBySlug(req: Request, res: Response): Promise<void> {
  try {
    const { slug } = req.params;
    const developer = await Developer.findOne({ slug });
    if (!developer) {
      res.status(404).json({ success: false, message: 'Developer not found' });
      return;
    }
    res.json({ success: true, developer });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function handleGetLocations(req: Request, res: Response): Promise<void> {
  try {
    const locations = await Location.find({ isActive: true });
    res.json({ success: true, locations });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Admin Community CRUD
export async function handleCreateCommunity(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const community = await Community.create(req.body);
    res.status(201).json({ success: true, community });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function handleUpdateCommunity(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const community = await Community.findByIdAndUpdate(id, req.body, { new: true });
    if (!community) {
      res.status(404).json({ success: false, message: 'Community not found' });
      return;
    }
    res.json({ success: true, community });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function handleDeleteCommunity(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    await Community.findByIdAndDelete(id);
    res.json({ success: true, message: 'Community deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Admin Developer CRUD
export async function handleCreateDeveloper(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const developer = await Developer.create(req.body);
    res.status(201).json({ success: true, developer });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function handleUpdateDeveloper(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const developer = await Developer.findByIdAndUpdate(id, req.body, { new: true });
    if (!developer) {
      res.status(404).json({ success: false, message: 'Developer not found' });
      return;
    }
    res.json({ success: true, developer });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function handleDeleteDeveloper(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    await Developer.findByIdAndDelete(id);
    res.json({ success: true, message: 'Developer deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
