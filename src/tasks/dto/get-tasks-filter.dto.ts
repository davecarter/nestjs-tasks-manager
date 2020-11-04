import { TaskStatus } from '../tasks.model'
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator'

export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus, {
    message: `Allowed status values are: ${Object.keys(TaskStatus)}`
  })
  status: TaskStatus

  @IsOptional()
  @IsNotEmpty()
  search: string
}
