<div class="app-menu navbar-menu">
    <!-- LOGO -->
    <div class="navbar-brand-box">
        <!-- Dark Logo-->
        <a href="/home" class="logo logo-dark">
            <span class="logo-sm">
                <img src="{{ asset('images/gonusa-logo-doang.png') }}" alt="logoDarkSm" height="38">
            </span>
            <span class="logo-lg">
                <img src="{{ asset('images/gonusa-logo-fit.png') }}" alt="logoDarkLg" height="31">
            </span>
        </a>
        <!-- Light Logo-->
        <a href="/home" class="logo logo-light">
            <span class="logo-sm">
                <img src="{{ asset('images/gonusa-logo-doang.png') }}" alt="logoLightSm" height="38">
            </span>
            <span class="logo-lg">
                <img src="{{ asset('images/gonusa-logo-fit.png') }}" alt="logoLightLg" height="31">
            </span>
        </a>
        <button type="button" class="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover" id="vertical-hover">
            <i class="ri-record-circle-line"></i>
        </button>
    </div>

    <div id="scrollbar">
        <div class="container-fluid">

            <div id="two-column-menu">
            </div>
            <ul class="navbar-nav" id="navbar-nav">
                <li class="menu-title"><span data-key="t-menu">Menu</span></li>
                <li class="nav-item">
                    <a class="nav-link menu-link" href="#sidebarDashboards" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="sidebarDashboards">
                        <i class="las la-tachometer-alt"></i> <span data-key="t-dashboards">Dashboards</span>
                    </a>
                    <div class="collapse menu-dropdown" id="sidebarDashboards">
                        <ul class="nav nav-sm flex-column">
                            <li class="nav-item">
                                <a href="/home" class="nav-link" data-key="t-crm"> Home</a>
                            </li>
                            <li class="nav-item">
                                <a href="/register" class="nav-link" data-key="t-analytics"> Register</a>
                            </li>
                        </ul>
                    </div>
                </li> <!-- end Dashboard Menu -->
                
                <li class="nav-item">
                    <a class="nav-link menu-link" href="#sidebarLayouts" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="sidebarLayouts">
                        <i class="las la-file-alt"></i> <span data-key="t-form">Configs</span> 
                    </a>
                    <div class="collapse menu-dropdown" id="sidebarLayouts">
                        <ul class="nav nav-sm flex-column">
                            <li class="nav-item">
                                <a href="/configs/user-access" class="nav-link" data-key="t-horizontal">List User Access</a>
                            </li>
                            <li class="nav-item">
                                <a href="/configs/user-tokens" class="nav-link" data-key="t-detached">List User Tokens</a>
                            </li>
                        </ul>
                    </div>
                </li> <!-- end Dashboard Menu -->

                <li class="nav-item">
                    <a class="nav-link menu-link" href="#sidebarAuth" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="sidebarAuth">
                        <i class="las la-clipboard-list"></i> <span data-key="t-clipboard">Surveys</span>
                    </a>
                    <div class="collapse menu-dropdown" id="sidebarAuth">
                        <ul class="nav nav-sm flex-column">
                            <li class="nav-item">
                                <a href="/survey/view" class="nav-link" data-key="t-detached">View Survey</a>
                            </li>
                            <li class="nav-item">
                                <a href="/survey/edit" class="nav-link" data-key="t-detached">Edit Survey</a>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>

    </div>

<!-- <div class="sidebar-background"></div> -->
</div>
<div class="vertical-overlay"></div>