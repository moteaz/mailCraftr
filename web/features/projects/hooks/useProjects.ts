import { useState, useEffect } from 'react';
import { projectService } from '@/lib/services/project.service';
import { userService } from '@/lib/services/user.service';
import { toast } from 'sonner';
import { MESSAGES } from '@/constants';
import type { Project, User, ApiError } from '@/types';

export function useProjects(userRole?: string) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadData();
  }, [userRole]);

  const loadData = async () => {
    try {
      if (userRole === 'SUPERADMIN') {
        const [projectsRes, usersRes] = await Promise.all([
          projectService.getPaginated(1, 100),
          userService.getAll(),
        ]);
        setProjects(projectsRes.data);
        setTotal(projectsRes.meta.total);
        setUsers(Array.isArray(usersRes) ? usersRes : usersRes.data || []);
      } else {
        const projectsRes = await projectService.getMyProjects();
        setProjects(projectsRes);
        setTotal(projectsRes.length);
      }
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message || MESSAGES.ERROR.LOAD_FAILED);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (data: { title: string; description: string; email: string[] }) => {
    const response: any = await projectService.create({ title: data.title, description: data.description });
    const projectId = response.project.id;

    for (const email of data.email) {
      await projectService.addUser(projectId, email);
    }

    await loadData();
    return response;
  };

  const deleteProject = async (id: number) => {
    await projectService.delete(id);
    await loadData();
  };

  const addUserToProject = async (projectId: number, email: string) => {
    await projectService.addUser(projectId, email);
    await loadData();
  };

  const removeUserFromProject = async (projectId: number, email: string) => {
    await projectService.removeUser(projectId, email);
    await loadData();
  };

  return {
    projects,
    users,
    loading,
    total,
    createProject,
    deleteProject,
    addUserToProject,
    removeUserFromProject,
  };
}
