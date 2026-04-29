interface Member {
  memberId: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
}

export default async function MembersPage() {
  const res = await fetch('http://localhost:3000/api/members', {
    cache: "no-store"
  })

  const json = await res.json()
  const members: Member[] = json.members

  return (
    <main>
      <h1>MembersPage</h1>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>

        <tbody>
          {members.map((member) => (
            <tr key={member.memberId}>
              <td>{member.memberId}</td>
              <td>{member.firstName}</td>
              <td>{member.lastName}</td>
              <td>{member.email}</td>
              <td>{member.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}