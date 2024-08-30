<!DOCTYPE html>
<html lang="en" data-layout="vertical" data-topbar="light" data-sidebar="dark" data-sidebar-size="sm" data-sidebar-image="none" data-preloader="disable" data-bs-theme="light" data-layout-width="fluid" data-layout-position="fixed" data-layout-style="default" data-sidebar-visibility="show">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>GOSY | PT. GONUSA PRIMA DISTRIBUSI</title>
    @include('layout.asset') 
    
</head>
<style>
        .page-content {
            margin: 0px;
        }

        ul.p-stepper-nav {
            margin-left: 2rem!important;
            margin-right: 2rem!important;
        }

        button {
            border-radius: 50%
        }

        ul {
            padding-left: 0rem;
        }
        
        @media (min-width: 768px) {
            .page-content {
                margin: 10px;
            }
        }
    </style>
<body>
    <div id="layout">
    <div id='loader'></div>
    @include('layout.header')
    @include('layout.sidebar')
    <div class="main-content overflow">
        <div class="page-content">
        <div id="root" data-userdata="{!! $globalData->toJson() !!}"></div>
        </div>
        </div>
        
    </div>
    <script src="{{ asset('js/app.js') }}"></script>
</body>
</html>