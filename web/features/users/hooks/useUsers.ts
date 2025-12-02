import { useState, useEffect } from "react";
import { userService } from "@/lib/services/user.service";
import { projectService } from "@/lib/services/project.service";
import { toast } from "sonner";
import { MESSAGES, PAGINATION } from "@/constants";
import type { User, Project, ApiError } from "@/types";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(
    PAGINATION.DEFAULT_PAGE
  );

  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersRes, projectsRes] = await Promise.all([
        userService.getPaginated(currentPage, PAGINATION.DEFAULT_LIMIT),
        projectService.getMyProjects(),
      ]);
      setUsers(usersRes.data);
      setTotalPages(usersRes.meta.totalPages);
      setTotal(usersRes.meta.total);
      setProjects(
        Array.isArray(projectsRes)
          ? projectsRes
          : (projectsRes as any).data || []
      );
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message || MESSAGES.ERROR.LOAD_FAILED);
    } finally {
      setLoading(false);
    }
  };

  const loadPage = async (page: number) => {
    try {
      const response = await userService.getPaginated(
        page,
        PAGINATION.DEFAULT_LIMIT
      );
      setUsers(response.data);
      setTotalPages(response.meta.totalPages);
      setTotal(response.meta.total);
      setCurrentPage(page);
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message || MESSAGES.ERROR.LOAD_FAILED);
    }
  };

  const createUser = async (data: {
    email: string;
    password: string;
    projectIds: string[];
  }) => {
    await userService.create({ email: data.email, password: data.password });

    for (const projectId of data.projectIds) {
      await projectService.addUser(parseInt(projectId), data.email);
    }

    await loadPage(currentPage);
  };

  const deleteUser = async (id: number) => {
    await userService.delete(id);
    await loadPage(currentPage);
  };

  return {
    users,
    projects,
    loading,
    currentPage,
    totalPages,
    total,
    createUser,
    deleteUser,
    loadPage,
  };
}
