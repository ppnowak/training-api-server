import express, { Request, Response, NextFunction } from 'express'
import { ApiError } from '../commons/errorHandler'

interface Address {
  street: string
  city: string
  zipCode: string
}

type Status = 'Pending' | 'Active' | 'Disabled' | 'Deleted'

interface User {
  id: number
  firstName: string
  lastName: string
  pin?: number
  registrationDate: Date
  status: Status
  address: Address
}

const getValidStatuses = () => ['Pending', 'Active', 'Disabled', 'Deleted']

const isValidStatus = (status: string): boolean => getValidStatuses().includes(status)

const randomDate = (): Date => {
  const currentDate = new Date()
  const twelveMonthsAgo = new Date()
  twelveMonthsAgo.setMonth(currentDate.getMonth() - 12)

  const randomTimestamp =
    twelveMonthsAgo.getTime() + Math.random() * (currentDate.getTime() - twelveMonthsAgo.getTime())
  const randomDate = new Date(randomTimestamp)

  return randomDate
}

let users: User[] = [
  {
    id: 1,
    firstName: 'Piotr',
    lastName: 'Nowak',
    registrationDate: randomDate(),
    status: 'Active',
    address: { street: 'Główna 8', city: 'Warszawa', zipCode: '00-300' },
  },
  {
    id: 2,
    firstName: 'Anna',
    lastName: 'Kowalska',
    registrationDate: randomDate(),
    status: 'Pending',
    address: { street: 'Podwale 15', city: 'Kraków', zipCode: '30-200' },
  },
  {
    id: 3,
    firstName: 'Jan',
    lastName: 'Nowicki',
    registrationDate: randomDate(),
    status: 'Active',
    address: { street: 'Rynek 10', city: 'Wrocław', zipCode: '50-100' },
  },
  {
    id: 4,
    firstName: 'Maria',
    lastName: 'Kowalczyk',
    registrationDate: randomDate(),
    status: 'Active',
    address: { street: 'Słowackiego 20', city: 'Poznań', zipCode: '60-500' },
  },
  {
    id: 5,
    firstName: 'Adam',
    lastName: 'Jankowski',
    registrationDate: randomDate(),
    status: 'Disabled',
    address: { street: 'Mickiewicza 5', city: 'Gdańsk', zipCode: '80-200' },
  },
  {
    id: 6,
    firstName: 'Ewa',
    lastName: 'Lis',
    registrationDate: randomDate(),
    status: 'Active',
    address: { street: 'Piłsudskiego 12', city: 'Łódź', zipCode: '90-100' },
  },
  {
    id: 7,
    firstName: 'Tomasz',
    lastName: 'Pawlak',
    registrationDate: randomDate(),
    status: 'Deleted',
    address: { street: 'Lecha 25', city: 'Katowice', zipCode: '40-500' },
  },
  {
    id: 8,
    firstName: 'Katarzyna',
    lastName: 'Czarnecka',
    registrationDate: randomDate(),
    status: 'Active',
    address: { street: 'Chrobrego 7', city: 'Szczecin', zipCode: '70-200' },
  },
  {
    id: 9,
    firstName: 'Marcin',
    lastName: 'Wójcik',
    registrationDate: randomDate(),
    status: 'Active',
    address: { street: 'Kościuszki 18', city: 'Bydgoszcz', zipCode: '85-100' },
  },
  {
    id: 10,
    firstName: 'Magdalena',
    lastName: 'Szymańska',
    registrationDate: randomDate(),
    status: 'Pending',
    address: { street: 'Konopnickiej 3', city: 'Lublin', zipCode: '20-300' },
  },
  {
    id: 11,
    firstName: 'Wojciech',
    lastName: 'Dąbrowski',
    registrationDate: randomDate(),
    status: 'Active',
    address: { street: 'Waryńskiego 16', city: 'Białystok', zipCode: '15-200' },
  },
  {
    id: 12,
    firstName: 'Karolina',
    lastName: 'Kaczmarek',
    registrationDate: randomDate(),
    status: 'Pending',
    address: { street: 'Sienkiewicza 22', city: 'Częstochowa', zipCode: '42-300' },
  },
  {
    id: 13,
    firstName: 'Michał',
    lastName: 'Grabowski',
    registrationDate: randomDate(),
    status: 'Disabled',
    address: { street: 'Wojska Polskiego 14', city: 'Radom', zipCode: '26-600' },
  },
  {
    id: 14,
    firstName: 'Alicja',
    lastName: 'Zielińska',
    registrationDate: randomDate(),
    status: 'Active',
    address: { street: 'Piastowska 9', city: 'Olsztyn', zipCode: '10-100' },
  },
  {
    id: 15,
    firstName: 'Krzysztof',
    lastName: 'Adamczyk',
    registrationDate: randomDate(),
    status: 'Active',
    address: { street: 'Gdańska 11', city: 'Toruń', zipCode: '87-100' },
  },
  {
    id: 16,
    firstName: 'Monika',
    lastName: 'Lipińska',
    registrationDate: randomDate(),
    status: 'Pending',
    address: { street: 'Kasprzaka 5', city: 'Gdynia', zipCode: '81-100' },
  },
  {
    id: 17,
    firstName: 'Robert',
    lastName: 'Sikora',
    registrationDate: randomDate(),
    status: 'Active',
    address: { street: 'Piotrkowska 7', city: 'Płock', zipCode: '09-100' },
  },
  {
    id: 18,
    firstName: 'Natalia',
    lastName: 'Jastrzębska',
    registrationDate: randomDate(),
    status: 'Active',
    address: { street: 'Wolska 2', city: 'Bielsko-Biała', zipCode: '43-300' },
  },
  {
    id: 19,
    firstName: 'Paweł',
    lastName: 'Borkowski',
    registrationDate: randomDate(),
    status: 'Disabled',
    address: { street: 'Krakowska 13', city: 'Rzeszów', zipCode: '35-200' },
  },
  {
    id: 20,
    firstName: 'Aleksandra',
    lastName: 'Walczak',
    registrationDate: randomDate(),
    status: 'Deleted',
    address: { street: 'Piwna 6', city: 'Kielce', zipCode: '25-100' },
  },
]
let userIdCounter = users.length + 1

const allowedPostKeys: (keyof User)[] = ['firstName', 'lastName', 'address', 'pin']
const allowedPatchKeys: (keyof User)[] = ['firstName', 'lastName', 'address', 'pin', 'status']

const isAllFieldsAllowed = (req: Request, allowedKeys: (keyof User)[]) => {
  const userFields = Object.keys(req.body)
  return userFields.every((field) => allowedKeys.includes(field as keyof User))
}

const addUser = (req: Request, res: Response, next: NextFunction) => {
  if (!isAllFieldsAllowed(req, allowedPostKeys)) {
    return next(new ApiError(400, 'Invalid fields in the request. Allowed are: ' + allowedPostKeys))
  }

  const { firstName, lastName, address, pin } = req.body

  if (!firstName || !lastName || !address || !address.street || !address.city || !address.zipCode) {
    return next(new ApiError(400, 'Incomplete user data.'))
  }

  const newUser: User = {
    id: userIdCounter++,
    firstName,
    lastName,
    registrationDate: new Date(),
    status: 'Pending',
    pin,
    address,
  }

  users.push(newUser)

  res.status(201).json({ userId: newUser.id })
}

const updateUser = (req: Request, res: Response, next: NextFunction) => {
  if (!isAllFieldsAllowed(req, allowedPatchKeys)) {
    return next(new ApiError(400, 'Invalid fields in the request. Allowed are: ' + allowedPatchKeys))
  }

  const userId = parseInt(req.params.userId, 10)
  const { firstName, lastName, address, status, pin } = req.body

  if (!firstName || !lastName || !address || !status || !address.street || !address.city || !address.zipCode) {
    return next(new ApiError(400, 'Incomplete user data.'))
  }

  if (!isValidStatus(status)) {
    return next(new ApiError(400, `Incorrect status ${status}. Allowed: ${getValidStatuses()}.`))
  }

  const userIndex = users.findIndex((user) => user.id === userId)

  if (userIndex === -1) {
    return next(new ApiError(404, 'User not found.'))
  }

  const updatedUser = users[userIndex]
  updatedUser.firstName = firstName
  updatedUser.lastName = lastName
  updatedUser.address = address
  updatedUser.status = status
  updatedUser.pin = pin

  res.json(updatedUser)
}

const patchUser = (req: Request, res: Response, next: NextFunction) => {
  if (!isAllFieldsAllowed(req, allowedPatchKeys)) {
    return next(new ApiError(400, 'Invalid fields in the request. Allowed are: ' + allowedPatchKeys))
  }

  const userId = parseInt(req.params.userId, 10)
  const { firstName, lastName, address, status, pin } = req.body

  const userIndex = users.findIndex((user) => user.id === userId)

  if (userIndex === -1) {
    return next(new ApiError(404, 'User not found.'))
  }

  if (!isValidStatus(status)) {
    return next(new ApiError(400, `Incorrect status ${status}. Allowed: ${getValidStatuses()}.`))
  }

  const updatedUser = users[userIndex]

  if (firstName) updatedUser.firstName = firstName
  if (lastName) updatedUser.lastName = lastName
  if (address) updatedUser.address = { ...updatedUser.address, ...address }
  if (status) updatedUser.status = status
  if (pin) updatedUser.pin = pin

  res.json(updatedUser)
}

const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
  let filteredUsers = [...users]

  // Filtracja po firstName
  if (req.query.firstName) {
    const firstNameFilter = new RegExp(req.query.firstName.toString(), 'i')
    filteredUsers = filteredUsers.filter((user) => firstNameFilter.test(user.firstName))
  }

  // Filtracja po firstName
  if (req.query.id) {
    filteredUsers = filteredUsers.filter((user) => user.id == parseInt(req.query.id as string))
  }

  // Filtracja po lastName
  if (req.query.lastName) {
    const lastNameFilter = new RegExp(req.query.lastName.toString(), 'i')
    filteredUsers = filteredUsers.filter((user) => lastNameFilter.test(user.lastName))
  }

  // Filtracja po registrationDate
  if (req.query.registrationDateFrom) {
    const fromDate = new Date(req.query.registrationDateFrom.toString())
    filteredUsers = filteredUsers.filter((user) => user.registrationDate >= fromDate)
  }

  if (req.query.registrationDateTo) {
    const toDate = new Date(req.query.registrationDateTo.toString())
    toDate.setDate(toDate.getDate() + 1) // Zwiększamy datę o jeden dzień, aby uwzględnić cały dzień
    filteredUsers = filteredUsers.filter((user) => user.registrationDate < toDate)
  }

  // Filtracja po address.street
  if (req.query.addressStreet) {
    const streetFilter = new RegExp(req.query.addressStreet.toString(), 'i')
    filteredUsers = filteredUsers.filter((user) => streetFilter.test(user.address.street))
  }

  // Filtracja po statusie
  if (req.query.status) {
    const statusFilter = req.query.status.toString()
    filteredUsers = filteredUsers.filter((user) => user.status === statusFilter)
  }

  // Sortowanie
  if (req.query.sortBy && filteredUsers.length > 0) {
    const sortBy = req.query.sortBy.toString() as keyof User // Używamy keyof User, aby uniknąć błędu indeksowania
    if (sortBy !== 'pin') {
      filteredUsers.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1))
    }
  }

  // Ograniczenie ilości wyników
  if (req.query.limit) {
    const limit = parseInt(req.query.limit.toString(), 10)
    filteredUsers = filteredUsers.slice(0, limit)
  }

  res.header('X-Total-Count', `${users.length}`)
  res.header('X-Filtered-Count', `${filteredUsers.length}`)
  if (req.query.showAddress !== 'true') {
    res.json(
      filteredUsers.map((it) => {
        const { id, firstName, lastName, registrationDate, status } = it
        return { id, firstName, lastName, registrationDate, status }
      }),
    )
    return
  }
  res.json(filteredUsers)
}

const getUserDetails = (req: Request, res: Response, next: NextFunction) => {
  const userId = parseInt(req.params.userId, 10)

  const user = users.find((user) => user.id === userId)

  if (!user) {
    return next(new ApiError(404, 'User not found.'))
  }

  res.json(user)
}

const deleteUser = (req: Request, res: Response, next: NextFunction) => {
  const userId = parseInt(req.params.userId, 10)
  const permanentDelete = req.query.permanent === 'true'

  const userIndex = users.findIndex((user) => user.id === userId)

  if (userIndex === -1) {
    return next(new ApiError(404, 'User not found.'))
  }

  const deletedUser = users[userIndex]

  if (permanentDelete) {
    users.splice(userIndex, 1)
  } else {
    const newStatus = 'Deleted'
    if (deletedUser.status === newStatus) {
      return next(new ApiError(401, 'User is already deleted!'))
    }
    deletedUser.status = newStatus
  }

  res.json(deletedUser)
}

const router = express.Router()

router.get('/users', getAllUsers)
router.post('/user', addUser)
router.put('/user/:userId', updateUser)
router.patch('/user/:userId', patchUser)
router.get('/user/:userId', getUserDetails)
router.delete('/user/:userId', deleteUser)

export default router
