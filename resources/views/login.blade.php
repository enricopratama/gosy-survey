<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign In | Custom Dashboard</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f0f2f5;
            font-family: 'Arial', sans-serif;
        }
        .auth-page-wrapper {
            width: 100%;
            max-width: 1200px;
            padding: 0 15px;
            margin: auto;
        }
        .auth-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url('your-background-image.jpg') no-repeat center center;
            background-size: cover;
        }
        .auth-page-content {
            position: relative;
            z-index: 1;
        }
        .auth-logo img {
            height: 50px;
        }
        .login-container {
            background-color: #fff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            max-width: 400px;
            width: 100%;
            margin: 0 auto;
        }
        .login-container h5 {
            margin-bottom: 20px;
        }
        .login-container p {
            margin-bottom: 30px;
            color: #6c757d;
        }
        .form-group label {
            font-weight: bold;
        }
        .form-group input {
            border-radius: 5px;
        }
        .btn-block {
            border-radius: 0px;
        }
        .alert {
            margin-bottom: 15px;
        }
        .signin-other-title {
            margin-top: 30px;
            margin-bottom: 20px;
            text-align: center;
        }
        .signin-other-title h5 {
            font-size: 16px;
        }
        .btn-icon {
            margin: 0 5px;
        }
        .footer {
            text-align: center;
            margin-top: 50px;
        }
        .auth-pass-inputgroup {
            position: relative;
        }
        .auth-pass-inputgroup .password-addon {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
        }
        .form-control-password {
            padding-right: 40px;
        }
    </style>
    
</head>
<body>
    <div class="auth-page-wrapper">
        <div class="auth-bg"></div>
        <div class="auth-page-content mt-4">
            <div class="container">
                <div class="login-container">
                    <div class="text-center mt-2">
                        <img class="mb-4" src="{{ asset('images/gonusa-logo-fit.png') }}" alt="logoLightLg" height="50">
                        <h5 class="text-dark font-weight-bold">GOSY</h5>
                        <p class="text-muted">Gonusa Survey Generator System</p>
                    </div>
                    @if (\Session::has('failed'))
                        <div class="alert alert-danger alert-dismissible fade show" role="alert">
                            <strong>Oh no!</strong> {!! \Session::get('failed') !!}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    @endif
                    <form action="/authenticated" method="POST">
                        @csrf
                        <div class="form-group mb-3">
                            <label for="username">Username</label>
                            <input type="text" name="username" class="form-control" id="username" placeholder="Enter username">
                            <small style="color:red">@error('username'){{ $message }} @enderror</small>
                        </div>
                        <div class="form-group mb-3">
                            <div class="d-flex justify-content-between flex-wrap">
                                <label for="password">Password</label>
                                <a href="#" class="text-muted">Forgot password?</a>
                            </div>
                            <div class="auth-pass-inputgroup">
                                <input type="password" name="password" class="form-control form-control-password" id="password" placeholder="Enter password">
                                <button class="btn btn-link password-addon" type="button"><i class="fas fa-eye"></i></button>
                            </div>
                            <small style="color:red">@error('password'){{ $message }} @enderror</small>
                        </div>
                        <div class="form-check mb-3">
                            <input class="form-check-input" type="checkbox" value="" id="auth-remember-check">
                            <label class="form-check-label" for="auth-remember-check">Remember me</label>
                        </div>
                        <button type="submit" class="btn btn-primary btn-block rounded">Sign In</button>
                    </form>
                    <div class="signin-other-title">
                        <h5 class="fs-13 mb-4">Or Sign In With</h5>
                        <div>
                            <button type="button" class="btn btn-primary btn-icon"><i class="fab fa-facebook-f"></i></button>
                            <button type="button" class="btn btn-danger btn-icon"><i class="fab fa-google"></i></button>
                            <button type="button" class="btn btn-dark btn-icon"><i class="fab fa-github"></i></button>
                            <button type="button" class="btn btn-info btn-icon"><i class="fab fa-twitter"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <footer class="footer">
            <div class="container">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="text-center pb-4">
                            Version 1.0.1
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    </div>

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script>
        $(function() {
            $(".password-addon").on("click", function() {
                var $passwordInput = $(this).prev("input");
                var type = $passwordInput.attr("type") === "password" ? "text" : "password";
                $passwordInput.attr("type", type);
                $(this).find("i").toggleClass("fa-eye fa-eye-slash");
            });
        });
    </script>
</body>
</html>
