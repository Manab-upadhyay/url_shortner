import Link from "./link.model";
import generateShortCode from "../../utils/generateShortcode";
async function addLink(
  link: string,
  name: string,
  userId: string,
  expiresAt?: Date,
) {
  try {
    let shortCode;
    let existsingLink;
    do {
      shortCode = generateShortCode();
      existsingLink = await Link.findOne({ shortCode });
    } while (existsingLink);

    const newLink = new Link({
      url: link,
      name,
      shortCode,
      userId,
      expiresAt,
    });
    await newLink.save();
    return newLink;
  } catch (error) {
    throw error;
  }
}
async function getLink(shortCode: string) {
  const link = await Link.findOne({ shortCode });
  if (!link) {
    throw new Error("Link not found");
  }
  return link;
}
async function getUserLinks(
  userId: string,
  page: number = 1,
  limit: number = 10,
) {
  const links = await Link.find({ userId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  if (links.length === 0) {
    throw new Error("No links found for this user");
  }
  return links;
}
async function deleteLink(linkId: string, userId: string) {
  const deletedLink = await Link.findOneAndDelete({ _id: linkId, userId });
  if (!deletedLink) {
    throw new Error("Link not found or unauthorized");
  }
  return deletedLink;
}
async function updateLink(
  linkId: string,
  userId: string,
  updates: { url?: string; name?: string; expiresAt?: Date },
) {
  const updatedLink = await Link.findOneAndUpdate(
    { _id: linkId, userId },
    { $set: updates },
    { new: true },
  );
  if (!updatedLink) {
    throw new Error("Link not found or unauthorized");
  }
  return updatedLink;
}
export { addLink, getLink, getUserLinks, deleteLink, updateLink };
