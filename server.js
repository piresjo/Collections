import {
    getConsoles,
    getConsoleInformation,
} from './db/js/database.js'
import makeApp from './app.js'

const app = makeApp({
    getConsoles,
    getConsoleInformation
})

const port = process.env.PORT || 3000;

app.listen(port, () => console.log("listening on port 3000"))