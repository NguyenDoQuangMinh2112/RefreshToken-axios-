import { StatusCodes } from "http-status-codes";
import ms from "ms";
import { JwtProvider } from "~/providers/jwtProvider";

const MOCK_DATABASE = {
  USER: {
    ID: "quangminhdev-sample-id-12345678",
    EMAIL: "nguyendoquangminh2112@gmail.com",
    PASSWORD: "1212123minh",
  },
};

const login = async (req, res) => {
  try {
    if (
      req.body.email !== MOCK_DATABASE.USER.EMAIL ||
      req.body.password !== MOCK_DATABASE.USER.PASSWORD
    ) {
      res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "Your email or password is incorrect!" });
      return;
    }

    const userInfo = {
      id: MOCK_DATABASE.USER.ID,
      email: MOCK_DATABASE.USER.EMAIL,
    };

    const secretSignatureAccessToken = process.env.ACCESS_TOKEN_SECRET;
    const secretSignatureRefreshToken = process.env.REFRESH_TOKEN_SECRET;
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      secretSignatureAccessToken,
      // "1h"
      "5s"
    );
    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      secretSignatureRefreshToken,
      "14 days"
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms("14 days"), // thời gian tồn tại của cookie
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms("14 days"), // thời gian tồn tại của cookie
    });

    // return info user and token

    res.status(StatusCodes.OK).json({
      ...userInfo,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(StatusCodes.OK).json({ message: "Logout API success!" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const refreshToken = async (req, res) => {
  try {
    // C1: lay tu cookies ra
    const refreshTokenFromCookie = req.cookies?.refreshToken;
    // C2: lay tu local storage phia FE truyen vao body
    const refreshTokenFromBody = req.body?.refreshToken;

    // verify that the refresh token
    const refreshTokenDecoded = await JwtProvider.verifyToken(
      // refreshTokenFromCookie,
      refreshTokenFromBody,
      process.env.REFRESH_TOKEN_SECRET
    );

    const userInfo = {
      id: refreshTokenDecoded.id,
      email: refreshTokenDecoded.email,
    };
    const secretSignatureAccessToken = process.env.ACCESS_TOKEN_SECRET;
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      secretSignatureAccessToken,
      // "1h"
      "5s"
    );
    // Res lai cookie accessToken moi
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms("14 days"),
    });
    res.status(StatusCodes.OK).json({ accessToken });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Refresh token api failed" });
  }
};

export const userController = {
  login,
  logout,
  refreshToken,
};
