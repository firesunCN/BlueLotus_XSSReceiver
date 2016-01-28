<?php
if (!defined('IN_XSS_PLATFORM')) {
    exit('Access Denied');
}

/*
 * Copyright 2011 Michael Cutler <m@cotdp.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A PHP implementation of RC4 based on the original C code from
 * the 1994 usenet post:
 *
 * http://groups.google.com/groups?selm=sternCvKL4B.Hyy@netcom.com
 *
 * @param key_str the key as a binary string
 * @param data_str the data to decrypt/encrypt as a binary string
 * @return the result of the RC4 as a binary string
 * @author Michael Cutler <m@cotdp.com>
 */
function rc4($data_str, $key_str) {
    // convert input string(s) to array(s)
    $key  = array();
    $data = array();
    for ($i = 0; $i < strlen($key_str); $i++) {
        $key[] = ord($key_str{$i});
    }
    for ($i = 0; $i < strlen($data_str); $i++) {
        $data[] = ord($data_str{$i});
    }
    // prepare key
    $state = array( 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,
                      16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,
                      32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,
                      48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,
                      64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,
                      80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,
                      96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,
                      112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,
                      128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,
                      144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,
                      160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,
                      176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,
                      192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,
                      208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,
                      224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,
                      240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255 );
    $len    = count($key);
    $index1 = $index2 = 0;
    for ($counter = 0; $counter < 256; $counter++) {
        $index2          = ($key[$index1] + $state[$counter] + $index2) % 256;
        $tmp             = $state[$counter];
        $state[$counter] = $state[$index2];
        $state[$index2]  = $tmp;
        $index1          = ($index1 + 1) % $len;
    }
    // rc4
    $len = count($data);
    $x   = $y = 0;
    for ($counter = 0; $counter < $len; $counter++) {
        $x         = ($x + 1) % 256;
        $y         = ($state[$x] + $y) % 256;
        $tmp       = $state[$x];
        $state[$x] = $state[$y];
        $state[$y] = $tmp;
        $data[$counter] ^= $state[($state[$x] + $state[$y]) % 256];
    }
    // convert output back to a string
    $data_str = "";
    for ($i = 0; $i < $len; $i++) {
        $data_str .= chr($data[$i]);
    }
    return $data_str;
}