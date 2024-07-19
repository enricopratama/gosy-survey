<!DOCTYPE html>
<html lang="en" data-layout="vertical" data-topbar="light" data-sidebar="dark" data-sidebar-size="sm" data-sidebar-image="none" data-preloader="disable" data-bs-theme="light" data-layout-width="fluid" data-layout-position="fixed" data-layout-style="default" data-sidebar-visibility="show">

<!-- <html
  lang="en"
  data-layout="vertical"
  data-topbar="light"
  data-sidebar="dark"
  data-sidebar-size="sm-hover"
  data-sidebar-image="none"
  data-preloader="disable"
  data-bs-theme="light" data-layout-width="fluid" 
  data-layout-position="fixed" data-layout-style="default" data-sidebar-visibility="show"
> -->

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>GOSY | PT. GONUSA PRIMA DISTRIBUSI</title>
    @include('layout.asset') 
</head>
<body>
    <div id="layout-wrapper">
    @include('layout.header')
    @include('layout.sidebar')
    <div class="main-content overflow">
        @yield('content')
        <div class="page-content" style="margin:30px">
        <div id="root" data-userdata="{!! $globalData->toJson() !!}"></div>
        </div>
        </div>
    </div>
    <script src="{{ asset('js/app.js') }}"></script>
    <script>
        let userData = {!! $globalData->toJson() !!};
    </script>
</body>
</html>