"use client"

import { Task } from '@prisma/client'
import { useMutation } from '@tanstack/react-query';
import React from 'react'
import { moveAfter as moveAfterAction } from "../(tasks)/actions";
import { useRouter } from 'next/navigation';

const DropIndicator = ({ routineId, moveAfter }:{routineId: string, moveAfter: Task}) => {
    const router = useRouter()

    const { mutateAsync: handleMoveAfter } = useMutation({
        mutationFn: moveAfterAction,
        onSuccess: () => {
            router.refresh();
        },
    });
    
  return (
    <div onDragOver={(e)=>{
        e.preventDefault()
    }}
    onDrop={async (e)=>{
      const  taskId = e.dataTransfer.getData("taskId")
    
        console.log(taskId);
        await handleMoveAfter({
            routine_id: routineId,
            move_after: moveAfter,
            task_to_move_id: taskId
        })
        router.refresh()
        
    }}
     className='h-2 w-full bg-red-500'/>
  )
}

export default DropIndicator