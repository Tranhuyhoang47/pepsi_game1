import {
  requestOtp,
  signIn,
  signOut,
  signUp,
  verifyOtp,
} from '../action/authentication.actions';
import {
  signInBegin,
  signInSuccess,
  signInFailed,
  signUpBegin,
  signUpSuccess,
  signUpFailed,
  requestOtpBegin,
  requestOtpFailed,
  requestOtpSuccess,
  verifyOtpBegin,
  verifyOtpFailed,
  verifyOtpSuccess,
  resetAllStateAuthentication,
  signOutBegin,
  signOutSuccess,
  signOutFailed,
} from '../slices/authentication';
import {of, concat} from 'rxjs';
import {filter, switchMap, map, catchError} from 'rxjs/operators';
import {Epic, combineEpics} from 'redux-observable';
import {resetAllStateAuthorized, saveUser} from '../slices/authorized';
import {SignInUseCase} from '../../domain/usecase/authentication/SignIn.use-case';
import {container} from 'tsyringe';
import {SignUpUseCase} from '../../domain/usecase/authentication/SignUp.use-case';
import {RequestOtpUseCase} from '../../domain/usecase/authentication/RequestOtp.use-case';
import {VerifyOtpUseCase} from '../../domain/usecase/authentication/VerifyOtp.use-case';
import {SignOutUseCase} from '../../domain/usecase/authentication/SignOut.use-case';

const getUserEpic: Epic = action$ => {
  return action$.pipe(
    filter(signIn.match),
    switchMap(action => {
      let usecase = container.resolve<SignInUseCase>('SignInUseCase');
      return concat(
        of(signInBegin()),
        usecase.call(action.payload).pipe(
          switchMap(res => {
            if (res !== undefined) return [saveUser(res), signInSuccess()];
            return [signInFailed()];
          }),
        ),
      );
    }),
  );
};

const signUpEpic: Epic = action$ => {
  return action$.pipe(
    filter(signUp.match),
    switchMap(action => {
      let usecase = container.resolve<SignUpUseCase>('SignUpUseCase');
      return concat(
        of(signUpBegin()),
        usecase.call(action.payload).pipe(
          switchMap(res => {
            if (res.success === true)
              return [saveUser(res.data), signUpSuccess()];
            return [signUpFailed()];
          }),
          catchError(() => of(signUpFailed())),
        ),
      );
    }),
  );
};

const requestOtpEpic: Epic = action$ => {
  return action$.pipe(
    filter(requestOtp.match),
    switchMap(action => {
      let usecase = container.resolve<RequestOtpUseCase>('RequestOtpUseCase');
      return concat(
        of(requestOtpBegin()),
        usecase.call(action.payload).pipe(
          map(res => requestOtpSuccess(res)),
          catchError(() => of(requestOtpFailed())),
        ),
      );
    }),
  );
};

const verifyOtpEpic: Epic = action$ => {
  return action$.pipe(
    filter(verifyOtp.match),
    switchMap(action => {
      let usecase = container.resolve<VerifyOtpUseCase>('VerifyOtpUseCase');
      return concat(
        of(verifyOtpBegin()),
        usecase.call(action.payload).pipe(
          map(res => {
            if (res.success === true) return verifyOtpSuccess();
            return verifyOtpFailed(res);
          }),
          catchError(res => of(verifyOtpFailed(res))),
        ),
      );
    }),
  );
};

const signOutEpic: Epic = action$ => {
  return action$.pipe(
    filter(signOut.match),
    switchMap(action => {
      let usecase = container.resolve<SignOutUseCase>('SignOutUseCase');
      return concat(
        of(signOutBegin()),
        usecase.call().pipe(
          switchMap(res => {
            if (res.success === true) {
              return [
                signOutSuccess(),
                resetAllStateAuthentication(),
                resetAllStateAuthorized(),
              ];
            } else {
              return [signOutFailed()];
            }
          }),
        ),
      );
    }),
  );
};

export {getUserEpic, signUpEpic, requestOtpEpic, verifyOtpEpic};
export const AuthenticationEpics = combineEpics(
  getUserEpic,
  signUpEpic,
  requestOtpEpic,
  verifyOtpEpic,
  signOutEpic,
);
