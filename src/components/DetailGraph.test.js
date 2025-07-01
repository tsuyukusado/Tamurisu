import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DetailGraph from "./DetailGraph";

// Chart.jsのレンダリングをモック（テストでは中身までは検証しない）
jest.mock("react-chartjs-2", () => ({
    Doughnut: () => <div data-testid="doughnut-chart" />,
}));

jest.mock("./GraphCenterLabel", () => (props) => (
    <div data-testid="graph-center-label">{props.totalSeconds}</div>
));

jest.mock("./BackButton", () => (props) => (
    <button onClick={props.onClick} data-testid="back-button">Back</button>
));

const mockTasks = [
    { id: 1, title: "Task A", tags: ["tag1"] },
    { id: 2, title: "Task B", tags: ["tag2"] },
];

const mockCompletedTasks = [
    { id: 3, title: "Task C", tags: ["tag1"] },
];

const mockTaskRecords = {
    1: [60, 120],  // Task A: 180秒
    2: [0],        // Task B: 0秒 → 除外される
    3: [90],       // Task C: 90秒
};

test("renders DetailGraph with correct data", () => {
    render(
        <DetailGraph
            tag="tag1"
            tasks={mockTasks}
            completedTasks={mockCompletedTasks}
            taskRecords={mockTaskRecords}
            onBack={jest.fn()}
        />
    );

    // タグ名の見出しが表示されているか
    expect(screen.getByText("tag1")).toBeInTheDocument();

    // Chart（Doughnut）が表示されているか
    expect(screen.getByTestId("doughnut-chart")).toBeInTheDocument();

    // 合計秒数が GraphCenterLabel に渡っているか（Task A:180 + Task C:90 = 270）
    expect(screen.getByTestId("graph-center-label")).toHaveTextContent("270");

    // BackButton が表示される
    expect(screen.getByTestId("back-button")).toBeInTheDocument();
});

test("does not render BackButton when onBack is not provided", () => {
    render(
        <DetailGraph
            tag="tag1"
            tasks={mockTasks}
            completedTasks={mockCompletedTasks}
            taskRecords={mockTaskRecords}
        />
    );

    expect(screen.queryByTestId("back-button")).not.toBeInTheDocument();
});

test("BackButton click triggers onBack", () => {
    const handleBack = jest.fn();

    render(
        <DetailGraph
            tag="tag1"
            tasks={mockTasks}
            completedTasks={mockCompletedTasks}
            taskRecords={mockTaskRecords}
            onBack={handleBack}
        />
    );

    fireEvent.click(screen.getByTestId("back-button"));
    expect(handleBack).toHaveBeenCalled();
});