import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";
import { validateMobile } from "../utilities";

class UserController {
  static newUser = async (req: Request, res: Response) => {
    //Get parameters from the body
    let {
      mobileNumber,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      email,
    } = req.body;
    let user = new User();
    user.mobileNumber = mobileNumber;
    user.firstName = firstName;
    user.lastName = lastName;
    user.dateOfBirth = dateOfBirth ? dateOfBirth : null;
    user.gender = gender;
    user.email = email;

    //Validade if the parameters are ok
    const errors = await validate(user);
    const errorList = [];
    if (errors.length > 0) {
      errors.forEach((item) => {
        if (item.constraints.isNotEmpty)
          errorList.push(item.constraints.isNotEmpty);
        if (item.constraints.isEmail) errorList.push(item.constraints.isEmail);
      });
    }
    if (!validateMobile(user.mobileNumber))
      errorList.push("mobile number must be a valid indonesian phone number");

    if (errorList.length > 0) {
      res
        .status(400)
        .send({ error: true, errorMessages: errorList, data: null });
      return;
    }

    const userRepository = getRepository(User);
    try {
      if (await userRepository.findOne({ mobileNumber: mobileNumber }))
        errorList.push("mobile number is already registered");
      if (await userRepository.findOne({ email: email }))
        errorList.push("email is already registered");
      if (errorList.length > 0) {
        res
          .status(400)
          .send({ error: true, errorMessages: errorList, data: null });
        return;
      }
      await userRepository.save(user);
    } catch (e) {
      res.status(409).send({
        error: true,
        errorMessages: [`error when saving user with error: ${e}`],
        data: null,
      });
      return;
    }

    //If all ok, send 201 response
    res
      .status(201)
      .send({ error: false, errorMessages: [], data: "User created" });
  };
}

export default UserController;
