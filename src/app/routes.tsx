import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { ParseTasks } from "./pages/ParseTasks";
import { ParseTaskDetail } from "./pages/ParseTaskDetail";
import { EvalTasks } from "./pages/EvalTasks";
import { CreateExperiment } from "./pages/CreateExperiment";
import { EvalTaskDetail } from "./pages/EvalTaskDetail";
import { EvalMetricsDocs } from "./pages/EvalMetricsDocs";
import { Datasets } from "./pages/Datasets";
import { CreateDataset } from "./pages/CreateDataset";
import { DatasetDetail } from "./pages/DatasetDetail";
import { AddDatasetVersion } from "./pages/AddDatasetVersion";

function IndexRedirect() {
  return <Navigate to="/parse-tasks" replace />;
}

function OldEvalRedirect() {
  return <Navigate to="/eval-tasks" replace />;
}

function OldMetricsRedirect() {
  return <Navigate to="/eval-tasks/metrics-docs" replace />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: IndexRedirect },
      { path: "parse-tasks", Component: ParseTasks },
      { path: "parse-tasks/:id", Component: ParseTaskDetail },
      { path: "eval-tasks", Component: EvalTasks },
      { path: "eval-tasks/create", Component: CreateExperiment },
      { path: "eval-tasks/metrics-docs", Component: EvalMetricsDocs },
      { path: "eval-tasks/:id", Component: EvalTaskDetail },
      { path: "datasets", Component: Datasets },
      { path: "datasets/create", Component: CreateDataset },
      { path: "datasets/:id", Component: DatasetDetail },
      { path: "datasets/:id/versions/new", Component: AddDatasetVersion },
      // Redirects for old routes
      { path: "eval-metrics", Component: OldMetricsRedirect },
      { path: "eval-experiments", Component: OldEvalRedirect },
      { path: "eval-experiments/*", Component: OldEvalRedirect },
      { path: "eval-results", Component: OldEvalRedirect },
      { path: "eval-results/*", Component: OldEvalRedirect },
    ],
  },
]);