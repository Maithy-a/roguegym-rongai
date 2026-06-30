import { auth, currentUser } from "@clerk/nextjs/server";
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

    const email = user.emailAddresses[0].emailAddress
        .trim()
        .toLowerCase();

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
                        authInvitationStatus: "accepted",
                        updatedAt: new Date(),
                    },
                }
            );

            employee.clerkId = userId;
            employee.authInvitationStatus = "accepted";
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

        authEnabled: employee.authEnabled,
        employmentStatus: employee.employmentStatus,
        authInvitationStatus: employee.authInvitationStatus,

        imageUrl: user.imageUrl,
    };
}