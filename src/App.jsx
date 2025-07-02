import TaskItem from "./components/TaskItem"; 
import React, { useState, useEffect } from "react";
import api from './services/api';   // Importando o serviço de API
import { Button, Input } from 'antd';


function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");

  const handleAddTask = async () => {
    // Verifica se o texto da nova tarefa não está vazio
    // Se estiver vazio, não faz nada (retorna)
    if (newTaskText.trim() === "") return;
    //Cria o objeto para a nova tarefa (sem o ID, o backend vai gerar um ID único)
    const taskToAdd = {
      text: newTaskText,
      completed: false,
    };
    try{
      // Envie o novo objeto ara a API via POST
      const response= await api.post('/api/tasks', taskToAdd);

      //A API nos retorna a tarefa recém-criada (agora com o ID correto)
      const newTaskFromApi = response.data;

      //Adicione a tarefa retornada pela API ao nosso estado locl do react

      setTasks([... tasks, newTaskFromApi])


    }catch(error){
      console.error("Erro ao adicionar a tarefa:", error);
    }
    // Limpa o campo de entrada após adicionar a tarefa
    setNewTaskText("");

  };

  // NOVA VERSÃO da função para ATUALIZAR (Marcar como Completa)
  const handleToggleComplete = async (id) => {
    try {
      // Primeiro, encontramos a tarefa no estado local para saber seu estado atual
      const taskToToggle = tasks.find(task => task.id === id);
      
      // Enviamos a requisição PUT para a API com o estado 'completed' invertido
      await api.put(`/api/tasks/${id}`, { ...taskToToggle, completed: !taskToToggle.completed });

      // Atualizamos o estado local para refletir a mudança instantaneamente na tela
      const updatedTasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Erro ao atualizar a tarefa:", error);
    }
  };
  
  // NOVA FUNÇÃO PARA DELETAR
 // NOVA VERSÃO da função para DELETAR
 const handleDeleteTask = async (id) => {
  try {
    // Envia a requisição DELETE para a API
    await api.delete(`/api/tasks/${id}`);

    // Atualiza o estado local removendo a tarefa, para refletir a mudança na tela
    const remainingTasks = tasks.filter(task => task.id !== id);
    setTasks(remainingTasks);
  } catch (error)
  {
    console.error("Erro ao deletar a tarefa:", error);
  }
};
//fUNÇÃO PARA LIMPAR AS TAREFAS MARCADAS COMO CONCLUÍDAS

const handleClearCompleted = async () => {
  // 1. Descobre quais tarefas precisam ser deletadas
  const tasksToDelete = tasks.filter(task => task.completed);
  
  try {
    // 2. Cria uma "promessa" de deleção para cada tarefa completada
    const deletePromises = tasksToDelete.map(task => 
      api.delete(`/api/tasks/${task.id}`)
    );
    
    // 3. Executa todas as deleções em paralelo e espera todas terminarem
    await Promise.all(deletePromises);

    // 4. Se tudo deu certo no back-end, atualiza o estado do front-end
    setTasks(tasks.filter(task => !task.completed));
    
  } catch (error) {
    console.error("Erro ao limpar as tarefas concluídas:", error);
  }
};

  // 3. Este é o Hook para buscar os dados iniciais da sua API
  useEffect(() =>{

        //Função assíncrona para buscar os dados da API

        const fetchTasks = async () =>{
          try {
            //Faz a chamda GET para a rota '/api/tasks'
            //a URL completa é 'http://localhost:5205/api/tasks'
            const response = await api.get('/api/tasks');
            //Atualiza o estado 'tasks' com os dados recebidos
            setTasks(response.data);
            
          } catch (error) {
            console.error("Erro ao buscar tarefas:", error);
            
          }
        };

        fetchTasks();

  }, []); // <-- Aqui você pode chamar a função para buscar os dados da API
  
  return (
    <div className="App">
      <h1>Minha Lista de Tarefas</h1>
      <div className="add-task-form">
        <Input
          type="text"
          placeholder="Digite uma nova tarefa"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onPressEnter={handleAddTask}
        />
        <Button onClick={handleAddTask}>Adicionar Tarefa</Button>
        <Button onClick={handleClearCompleted} className="clear-btn">
        Limpar Concluídas
      </Button>
      </div>
      <div className="task-list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            id={task.id}
            text={task.text}
            completed={task.completed} // <-- PROP NOVA E IMPORTANTE
            onToggle={handleToggleComplete}
            onDelete={handleDeleteTask}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
