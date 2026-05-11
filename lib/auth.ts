import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import clientPromise from "@/lib/mongodb";

export async function getCurrentEmployee() {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    const user = await currentUser();
    if (!user?.emailAddresses?.[0]?.emailAddress) {
        return null;
    }

    const email = user.emailAddresses[0].emailAddress;

    const client = await clientPromise;
    const db = client.db("rogue-gym-rongai");

    let employee = await db.collection("employees").findOne({
        clerkId: userId,
        authEnabled: true,
        employmentStatus: "active",
    });

    if (!employee) {
        employee = await db.collection("employees").findOne({
            email,
            authEnabled: true,
            employmentStatus: "active",
        });

        if (employee) {
            await db.collection("employees").updateOne(
                { _id: employee._id },
                {
                    $set: {
                        clerkId: userId,
                        updatedAt: new Date(),
                    },
                }
            )

            const clerk = await clerkClient();

            await clerk.users.updateUser(userId, {
                firstName: employee.firstName,
                lastName: employee.lastName,
            });
        }
    }

    if (!employee) {
        return null;
    }

    return {
        clerkId: userId,
        employeeId: employee._id.toString(),
        firstName: employee.firstName,
        lastName: employee.lastName,
        fullName: `${employee.firstName} ${employee.lastName}`,
        email: employee.email,
        role: employee.role,
        branch: employee.branch,
        imageUrl: user.imageUrl,
    };
}