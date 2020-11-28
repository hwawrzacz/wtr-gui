import { Employee } from '../model/employee'
import { SimpleEmployee } from '../model/simple-employee';

export const stringifyEmployee = (employee: Employee | SimpleEmployee) => `${employee.firstName} ${employee.lastName}`;