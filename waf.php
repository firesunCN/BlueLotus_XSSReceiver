<?php
header("Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-src 'none'");
header("X-Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-src 'none'");
header("X-WebKit-CSP: default-src 'self'; style-src 'self' 'unsafe-inline';img-src 'self' data:; frame-src 'none'");
header("X-XSS-Protection: 1; mode=block");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");