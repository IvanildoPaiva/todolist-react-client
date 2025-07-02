import React from 'react';

// 1. Importe os componentes que vamos usar do AntD e dos ícones
import { Card, Button, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import './TaskItem.css';

// Recebendo todas as props necessárias
const TaskItem = ({ id, text, completed, onToggle, onDelete }) => {
  
  // A lógica para a classe CSS continua a mesma
  const taskClassName = `task-item ${completed ? 'completed' : ''}`;

  // Função para o clique do botão de deletar, com o stopPropagation
  const handleDeleteClick = (event) => {
    event.stopPropagation();
    onDelete(id);
  };

  return (
    // 2. Usamos o Card como o container principal
    <Card
      className={taskClassName}
      onClick={() => onToggle(id)}
      hoverable // Adiciona um efeito de sombra ao passar o mouse
    >
      <div className="task-content">
        <p>{text}</p>
        
        {/* 3. O botão de deletar agora é um componente AntD com um ícone */}
        <Tooltip title="Deletar Tarefa">
          <Button
            type="text" // Botão sem fundo, só o ícone
            danger       // Deixa o ícone vermelho
            icon={<DeleteOutlined />}
            onClick={handleDeleteClick}
          />
        </Tooltip>
      </div>
    </Card>
  );
};

export default TaskItem;