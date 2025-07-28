import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import Icon from '@/components/ui/icon';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: Date;
  category: string;
}

interface Notification {
  id: string;
  type: 'deadline' | 'overdue';
  task: Task;
  message: string;
}

const TaskManager = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const [tasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Подготовить отчет по продажам',
      description: 'Анализ продаж за Q4 2024',
      status: 'in_progress',
      priority: 'high',
      assignee: 'Иванов А.А.',
      dueDate: new Date(2025, 6, 30),
      category: 'Отчетность'
    },
    {
      id: '2',
      title: 'Организовать встречу с клиентом',
      description: 'Обсуждение нового проекта',
      status: 'pending',
      priority: 'medium',
      assignee: 'Петрова М.В.',
      dueDate: new Date(2025, 6, 29),
      category: 'Встречи'
    },
    {
      id: '3',
      title: 'Обновить базу данных',
      description: 'Миграция на новую версию',
      status: 'overdue',
      priority: 'high',
      assignee: 'Сидоров П.И.',
      dueDate: new Date(2025, 6, 25),
      category: 'IT'
    },
    {
      id: '4',
      title: 'Провести аудит безопасности',
      description: 'Проверка системы безопасности',
      status: 'completed',
      priority: 'high',
      assignee: 'Козлов В.С.',
      dueDate: new Date(2025, 6, 20),
      category: 'Безопасность'
    },
    {
      id: '5',
      title: 'Написать техническую документацию',
      description: 'Документация для нового API',
      status: 'pending',
      priority: 'low',
      assignee: 'Морозова Е.Н.',
      dueDate: new Date(2025, 7, 5),
      category: 'Документация'
    }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Generate notifications
  useEffect(() => {
    const today = new Date();
    const notifs: Notification[] = [];

    tasks.forEach(task => {
      const daysDiff = Math.ceil((task.dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
      
      if (task.status === 'overdue') {
        notifs.push({
          id: `overdue-${task.id}`,
          type: 'overdue',
          task,
          message: `Задача "${task.title}" просрочена на ${Math.abs(daysDiff)} дн.`
        });
      } else if (daysDiff <= 2 && daysDiff >= 0 && task.status !== 'completed') {
        notifs.push({
          id: `deadline-${task.id}`,
          type: 'deadline',
          task,
          message: `Дедлайн задачи "${task.title}" через ${daysDiff} дн.`
        });
      }
    });

    setNotifications(notifs);
  }, [tasks]);

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  // Statistics
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    overdue: tasks.filter(t => t.status === 'overdue').length,
    pending: tasks.filter(t => t.status === 'pending').length
  };

  const completionRate = Math.round((stats.completed / stats.total) * 100);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'in_progress': return 'bg-info text-info-foreground';
      case 'overdue': return 'bg-destructive text-destructive-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-destructive bg-destructive/5';
      case 'medium': return 'border-l-warning bg-warning/5';
      case 'low': return 'border-l-success bg-success/5';
      default: return 'border-l-muted';
    }
  };

  const tasksForSelectedDate = selectedDate 
    ? tasks.filter(task => 
        task.dueDate.toDateString() === selectedDate.toDateString()
      )
    : [];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Панель управления поручениями</h1>
            <p className="text-muted-foreground">Контроль исполнения и мониторинг задач</p>
          </div>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <div className="relative">
                <Icon name="Bell" className="h-5 w-5 text-muted-foreground" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-[10px] text-destructive-foreground flex items-center justify-center">
                  {notifications.length}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <Card className="border-destructive/20 bg-destructive/5 animate-fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Icon name="AlertTriangle" className="h-5 w-5" />
                Уведомления ({notifications.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {notifications.slice(0, 3).map(notif => (
                <div key={notif.id} className="flex items-center gap-3 p-2 bg-background/50 rounded-lg border">
                  <Icon 
                    name={notif.type === 'overdue' ? 'AlertCircle' : 'Clock'} 
                    className={`h-4 w-4 ${notif.type === 'overdue' ? 'text-destructive' : 'text-warning'}`} 
                  />
                  <span className="text-sm font-medium">{notif.message}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {notif.task.assignee}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="animate-scale-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Всего задач</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Icon name="FileText" className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Выполнено</p>
                  <p className="text-2xl font-bold text-success">{stats.completed}</p>
                </div>
                <Icon name="CheckCircle" className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">В работе</p>
                  <p className="text-2xl font-bold text-info">{stats.inProgress}</p>
                </div>
                <Icon name="Clock" className="h-8 w-8 text-info" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Просрочено</p>
                  <p className="text-2xl font-bold text-destructive">{stats.overdue}</p>
                </div>
                <Icon name="AlertTriangle" className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Прогресс</p>
                  <span className="text-sm font-medium">{completionRate}%</span>
                </div>
                <Progress value={completionRate} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-1 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Calendar" className="h-5 w-5" />
                Календарь задач
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border w-full"
              />
              {tasksForSelectedDate.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium text-sm">Задачи на выбранную дату:</h4>
                  {tasksForSelectedDate.map(task => (
                    <div key={task.id} className="p-2 bg-muted rounded-lg">
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.assignee}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Task List */}
          <Card className="lg:col-span-2 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="List" className="h-5 w-5" />
                Список поручений
              </CardTitle>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Поиск задач..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    <SelectItem value="pending">Ожидает</SelectItem>
                    <SelectItem value="in_progress">В работе</SelectItem>
                    <SelectItem value="completed">Выполнено</SelectItem>
                    <SelectItem value="overdue">Просрочено</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Приоритет" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все приоритеты</SelectItem>
                    <SelectItem value="high">Высокий</SelectItem>
                    <SelectItem value="medium">Средний</SelectItem>
                    <SelectItem value="low">Низкий</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredTasks.map((task, index) => (
                <div 
                  key={task.id} 
                  className={`p-4 border-l-4 rounded-lg border transition-all hover:shadow-md ${getPriorityColor(task.priority)} animate-fade-in`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{task.title}</h3>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status === 'pending' && 'Ожидает'}
                          {task.status === 'in_progress' && 'В работе'}
                          {task.status === 'completed' && 'Выполнено'}
                          {task.status === 'overdue' && 'Просрочено'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Icon name="User" className="h-3 w-3" />
                          {task.assignee}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="Calendar" className="h-3 w-3" />
                          {task.dueDate.toLocaleDateString('ru-RU')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="Tag" className="h-3 w-3" />
                          {task.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        task.priority === 'high' ? 'destructive' : 
                        task.priority === 'medium' ? 'default' : 'secondary'
                      }>
                        {task.priority === 'high' && 'Высокий'}
                        {task.priority === 'medium' && 'Средний'}
                        {task.priority === 'low' && 'Низкий'}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Icon name="MoreHorizontal" className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredTasks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="Search" className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Задачи не найдены</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;