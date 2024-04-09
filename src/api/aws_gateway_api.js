export async function storeDetailsInDynamoDB(details, idToken) {
  try {
    const response = await fetch(
      "https://9arj3sgsx5.execute-api.us-east-1.amazonaws.com/final",
      {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(details),
      },
    );
    if (response.ok) {
      const body = await response.json();
      return body.id;
    } else {
      return "Table not updated";
    }
  } catch (error) {
    console.error(error);
  }
}
