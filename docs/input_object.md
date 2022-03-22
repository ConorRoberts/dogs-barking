# Input Object

The User's input is stored into an object using the following format

```ts
Input {
    Command: string,
    Flags: string[],
    QueryTypes: Query
}
```
| Property | Type | Description | Example | Required |
|------------|---------|-------------|---------------|---------------|
| Command | `String` | The command used in terminal | `query` or `makegraph` | **Yes** |
| Flags | `String[]` |-------------|---------------|---------------|
| QueryTypes | `Query` | Stores all information related to queries (ie: types, parameters) | See below | Yes |


## Query Subtype

All query related data is stored in its own subtype using the following format:

```ts
Query {
    department: string,
    coursecode: string,
    weight: number,
    coursenum: number,
    level: number,
    prerequisite: string[],
    semester: string[],
    title: string[],
}
```

**Note:** one of the following are required:

| Property | Type | Description | Example | Acceptable Values |
|------------|---------|-------------|---------------|---------------|
| department | `String` | The department code | `CIS` or `MGMT` | All caps 3 or 4 letter string, `/([A-Z]{3})/ | /([A-Z]{4})/` |
| coursecode | `String` | A specific course code, combination of 3/4 letters and 4 numbers | `ACCT*1220` or `CIS*2750` | All caps 3/4 letter string, 4 character number separated by an asterisk * `/([A-Z]{3}*[0-9]{4})/ | /([A-Z]{4}*[0-9]{4})/`|
| weight | `Number` | The credit weight of a course |---------------|---------------|
| coursenum | `Number` | The number of a course | `1300`, `2150`, `3760` | 4 digit number between 1000 and 9000 |
| level | `Number` | The year level of the course | `1000`, `4000`, `6000`| Any number from 1-9 followed by 4 zeroes|
| prerequisite | `String[]` | A list of prerequisite criteria | `15.00 credits`, `CIS*1300`, `10.00 Credits and CIS*1000` | Alphanumeric strings and/or Course codes |
| semester | `String[]` | A list of semester offerings, | `F`, `W`, `S` | F -> Fall, W->Winter, S->Summer|
| title | `String[]` | A keyword belonging to a course's title/name | `Programming`, `Calculus` | Alphanumeric Strings |
