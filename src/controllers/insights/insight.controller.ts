import { Request, Response } from 'express';
import { Insight } from '../../models/Insight.js';
import { AuthenticatedRequest } from '../../middleware/authenticate.js';
import { slugify } from '../../shared/utils/slugify.js';

export async function handleGetInsights(req: Request, res: Response): Promise<void> {
  try {
    const query: any = {};
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Unless admin, show only published
    query.isPublished = true;

    const insights = await Insight.find(query).sort({ publishedAt: -1 });
    res.json({ success: true, count: insights.length, insights });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function handleGetInsightBySlug(req: Request, res: Response): Promise<void> {
  try {
    const { slug } = req.params;
    const insight = await Insight.findOne({ slug });
    if (!insight) {
      res.status(404).json({ success: false, message: 'Insight article not found' });
      return;
    }

    const related = await Insight.find({
      _id: { $ne: insight._id },
      category: insight.category,
      isPublished: true
    }).limit(3);

    res.json({ success: true, insight, related });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function handleCreateInsight(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const body = req.body;
    const slug = body.slug || slugify(body.title);

    const insight = await Insight.create({
      ...body,
      slug,
      publishedAt: body.isPublished !== false ? new Date() : undefined
    });

    res.status(201).json({ success: true, message: 'Insight article created', insight });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function handleUpdateInsight(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const insight = await Insight.findByIdAndUpdate(id, req.body, { new: true });
    if (!insight) {
      res.status(404).json({ success: false, message: 'Insight not found' });
      return;
    }
    res.json({ success: true, message: 'Insight article updated', insight });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function handleDeleteInsight(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    await Insight.findByIdAndDelete(id);
    res.json({ success: true, message: 'Insight removed' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
