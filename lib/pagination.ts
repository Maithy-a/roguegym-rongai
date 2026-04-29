export function getPagination(request: Request) {
    const { searchParams } = new URL(request.url);

    let page = Number(searchParams.get("page")) || 1;
    let limit = Number(searchParams.get("limit")) || 10;

    // Defaults
    if (!page || page < 1) page = 1;
    if (!limit || limit < 1) limit = 10;

    // prevent abuse
    if (limit > 100) limit = 100;

    const skip = (page - 1) * limit;

    return { page, limit, skip };
}