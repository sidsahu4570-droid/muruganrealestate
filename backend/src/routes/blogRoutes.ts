import { Router } from 'express';
import { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog } from '../controllers/blogController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', getBlogs);
router.get('/:slug', getBlogBySlug);
router.post('/', authenticate, authorize(['super_admin', 'admin', 'sales_executive']), createBlog);
router.put('/:id', authenticate, authorize(['super_admin', 'admin', 'sales_executive']), updateBlog);
router.delete('/:id', authenticate, authorize(['super_admin', 'admin']), deleteBlog);

export default router;
