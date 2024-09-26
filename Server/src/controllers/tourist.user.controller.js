export const login = async (req, res) => {
  try {
    const reqData = req.body;
    // const userId = req.headers.token ? await extractUserId(req.headers.token) : null;
    const userId = req.body.id;
    res.status(200).json(changedDetails);
  } catch (err) {
    res.status(404).json(err);
  }
};

export const signup = async (req, res) => {
  try {
    // const token = req.headers.token;
    // let userId = await extractUserId(token);
    const reqData = req.body;
    res.status(200).json(resetPassword);
  } catch (err) {
    res.status(404).json(err);
  }
};

export const changePassword = async (req, res) => {
  try {
  } catch (err) {
    res.status(404).json(err);
  }
};

