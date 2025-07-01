import React, { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import TaskDetail from "./components/TaskDetail";
import TaskList from "./components/TaskList";
import CompletedTasks from "./components/CompletedTasks";
import OthersView from "./components/OthersView";
import MenuBar from "./components/MenuBar";
import TagGraphView from "./components/TagGraphView";
import RecordPage from "./components/RecordPage";
import SearchBar from "./components/SearchBar";
import DetailGraph from "./components/DetailGraph";
import CalendarView from "./components/CalendarView";
import "./App.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import updateLocale from "dayjs/plugin/updateLocale";
import Container from "./components/Container";
import InfoPage from "./components/InfoPage";
import UnifiedTagGraphView from "./components/UnifiedTagGraphView";

dayjs.extend(updateLocale);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.locale("ja");

function App() {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [view, setView] = useState("tasks");
  const [subView, setSubView] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchTagFilter, setSearchTagFilter] = useState("");
  const inputRef = useRef();
  const [searchVisible, setSearchVisible] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [taskRecords, setTaskRecords] = useState({});
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [graphRefreshKey, setGraphRefreshKey] = useState(0);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const storedCompleted = JSON.parse(localStorage.getItem("completedTasks")) || [];
    const rawRecords = JSON.parse(localStorage.getItem("taskRecords")) || {};

    const convertedRecords = {};
    let needsUpdate = false;

    for (const [taskId, records] of Object.entries(rawRecords)) {
      convertedRecords[taskId] = records.map((record) => {
        if (typeof record === "number") {
          needsUpdate = true;
          return {
            duration: record,
            date: new Date().toISOString(),
          };
        }
        return record;
      });
    }

    // ✅ ここに追記！ 孤立レコードの掃除
    const validTaskIds = [...storedTasks, ...storedCompleted].map(t => t.id.toString());
    const cleanedRecords = Object.fromEntries(
      Object.entries(convertedRecords).filter(([taskId]) =>
        validTaskIds.includes(taskId)
      )
    );

    if (needsUpdate) {
      localStorage.setItem("taskRecords", JSON.stringify(cleanedRecords));
      console.log("✅ 旧形式 taskRecords を新形式に変換・保存しました");
    }

    setTasks(storedTasks);
    setCompletedTasks(storedCompleted);
    setTaskRecords(cleanedRecords); // ← ここも cleanedRecords に変更！
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
    }
  }, [completedTasks, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("taskRecords", JSON.stringify(taskRecords));
    }
  }, [taskRecords, isInitialized]);

  useEffect(() => {
    if (!showSearchBar) {
      setSearchKeyword("");
      setSearchTagFilter("");
      setDateFrom("");
      setDateTo("");
    }
  }, [showSearchBar]);

  const toggleSearch = () => {
    const newValue = !showSearchBar;
    setShowSearchBar(newValue);
    if (!newValue) {
      setSearchKeyword("");
      setSearchTagFilter("");
      setDateFrom("");
      setDateTo("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isComposing && newTask.trim() !== "") {
      const text = newTask.trim();

      const keywordTags = searchKeyword.trim().split(/[,　\s]+/).filter(Boolean);
      const tagFilterTags = searchTagFilter.trim().split(/[,　\s]+/).filter(Boolean);

      const combinedTags = Array.from(new Set([...keywordTags, ...tagFilterTags]));

      const dueDate = dateTo || null;

      setTasks([...tasks, {
        id: Date.now(),
        title: text,
        completed: false,
        tags: combinedTags,
        dueDate,
      }]);

      setNewTask("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newTasks = Array.from(tasks);
    const [movedItem] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, movedItem);
    setTasks(newTasks);
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const toggleTask = (id) => {
    setRemovingId(id);
    setTimeout(() => {
      const target = tasks.find(t => t.id === id);
      if (!target) return;
      setTasks(tasks.filter(t => t.id !== id));
      setCompletedTasks(prev => [...prev, { ...target, completed: true }]);
      setRemovingId(null);
    }, 300);
  };

  const restoreTask = (id) => {
    setRemovingId(id);
    setTimeout(() => {
      const target = completedTasks.find(t => t.id === id);
      if (!target) return;
      setCompletedTasks(completedTasks.filter(t => t.id !== id));
      setTasks([...tasks, { ...target, completed: false }]);
      setRemovingId(null);
    }, 300);
  };

  const deleteTask = (id) => {
    setRemovingId(id);
    setTimeout(() => {
      if (view === "others" && subView === "completed") {
        setCompletedTasks(prev => prev.filter(t => t.id !== id));
      } else {
        setTasks(prev => prev.filter(t => t.id !== id));
      }
      setRemovingId(null);
    }, 300);
  };

  const viewTitles = {
    others: "Others",
    today: "Today",
    tasks: "Tasks",
    record: "Timer",
    calendar: "Calendar",
    graph: "Graph",
    detail: "Tasks"
  };

  const filteredTasks = tasks.filter(task => {
    const keywordWords = searchKeyword.trim().split(/\s+/).filter(Boolean);
    const tagWords = searchTagFilter.trim().split(/\s+/).filter(Boolean);

    const matchesKeyword = keywordWords.length === 0 || keywordWords.every(word =>
      (task.title || "").includes(word) || (task.tags || []).some(tag => tag.includes(word))
    );

    const matchesTag = tagWords.length === 0 || tagWords.every(word =>
      (task.tags || []).some(tag => tag.includes(word))
    );

    const taskDate = task.dueDate ? new Date(task.dueDate) : null;
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;

    const matchesDate = !taskDate || (
      (!fromDate || taskDate >= fromDate) &&
      (!toDate || taskDate <= toDate)
    );

    return matchesKeyword && matchesTag && matchesDate;
  });

  const renderView = () => {
    const inner = (() => {
      if (view === "detail" && selectedTask) {
        return (
          <TaskDetail
            task={selectedTask}
            onClose={() => setView("tasks")}
            onUpdate={updateTask}
            onUpdateTags={(id, newTags) => {
              const updatedTask = tasks.find(t => t.id === id);
              if (!updatedTask) return;
              updateTask({ ...updatedTask, tags: newTags });
            }}
            setTaskRecords={setTaskRecords}
          />
        );
      }

      if (view === "record") {
        return (
          <RecordPage
            tasks={tasks}
            taskRecords={taskRecords}
            setTaskRecords={setTaskRecords}
          />
        );
      }

      if (view === "graph") {
        return selectedTag ? (
          <DetailGraph
            tag={selectedTag}
            tasks={tasks}
            completedTasks={completedTasks}
            taskRecords={taskRecords}
            onBack={() => setSelectedTag(null)}
          />
        ) : (
          <UnifiedTagGraphView
            tasks={tasks}
            completedTasks={completedTasks}
            taskRecords={taskRecords}
            onTagClick={(tag) => setSelectedTag(tag)}
          />
        );
      }

      if (view === "others") {
        if (subView === "completed") {
          return (
            <CompletedTasks
              completedTasks={completedTasks}
              restoreTask={restoreTask}
              deleteTask={deleteTask}
              setSubView={setSubView}
              onTaskClick={setSelectedTask}
            />
          );
        } else if (subView === "info") {
          return <InfoPage setSubView={setSubView} />;
        } else {
          return <OthersView setSubView={setSubView} />;
        }
      }

      if (view === "tasks") {
        return (
          <>
            {showSearchBar && (
              <SearchBar
                keyword={searchKeyword}
                setKeyword={setSearchKeyword}
                tagFilter={searchTagFilter}
                setTagFilter={setSearchTagFilter}
                dateFrom={dateFrom}
                setDateFrom={setDateFrom}
                dateTo={dateTo}
                setDateTo={setDateTo}
              />
            )}
            <TaskList
              tasks={filteredTasks}
              removingId={removingId}
              setSelectedTask={setSelectedTask}
              setView={setView}
              toggleTask={toggleTask}
              deleteTask={deleteTask}
              newTask={newTask}
              setNewTask={setNewTask}
              handleKeyDown={handleKeyDown}
              inputRef={inputRef}
              setIsComposing={setIsComposing}
              handleDragEnd={handleDragEnd}
              showSearchBar={showSearchBar}
            />
          </>
        );
      }

      return <div style={{ padding: "1rem" }}>🚧 機能準備中 ({view})</div>;
    })();

    if (view === "calendar") {
      return (
        <>
          <Container>
            <div className="header-bar">
              <h1>{viewTitles[view]}</h1>
            </div>
          </Container>
          <CalendarView
            tasks={[...tasks, ...completedTasks]}
            onDateSelect={(dateStr) => {
              setView("tasks");
              setDateFrom(dateStr);
              setDateTo(dateStr);
              setShowSearchBar(true);
            }}
            onTaskClick={(taskId) => {
              const target = [...tasks, ...completedTasks].find(t => t.id === taskId);
              if (target) {
                setSelectedTask(target);
                setView("detail");
              }
            }}
          />
        </>
      );
    }
    return <Container>{inner}</Container>;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
      <div className="app">
        {view !== "calendar" && (
          <Container>
            <div
              className="header-bar"
              style={view === "calendar" ? { paddingTop: "20px" } : {}}
            >
              <h1>{viewTitles[view]}</h1>
              {view === "tasks" && (
                <FaSearch
                  size={20}
                  style={{ cursor: "pointer" }}
                  onClick={toggleSearch}
                />
              )}
            </div>
          </Container>
        )}
        {renderView()}
        <MenuBar
          view={view}
          setView={(v) => {
            setView(v);
            if (v === "graph") {
              setSelectedTag(null);
              setGraphRefreshKey(prev => prev + 1);
            }
          }}
          setSubView={setSubView}
        />
      </div>
    </LocalizationProvider>
  );
}

export default App;
