# Credential Verify

Credential Verify is intended to be an off-chain enterprise solution pointed at cryptographically verifying Educational Institutions awarded credentials.  This is round of of probably 3 before completed.

# Avoiding Common Attacks
1. Logic Bugs - solidity unit testing shows basic functionality works, enhanced javascript testing
will be necessary to fully test and impliment modifiers.

2. Failed Sends - no Ether transfers occur in the contract that are not gas payments.  

3. Re-entry - no ether transfers, as well as users only act on their own data, and can't change anothers data.

4. Integer Arithmetic Overflow - Contract uses uint32 as a base type, and uses SafeMath32 library to cover overflows.

5. Poison Data - in each case you act on your own data, and no ether is transfered.  version 2 will use modifiers to 
further limit downstream contracts through the use of isCredentialOrg function.

6. Exposed functions - again since actors only act on their own data, and no ether is transfered, even if a bad actor does manage to call the function, it still doesn't interact with anyone elses data.  Further limiting using modifiers will occur in version 2 and the upgrade to Javascript testing for more fucntional testing 

7. Exposed Secrets - there are no secrets to keep in this org.

8. Denial of Service/Dust Spam - this was mitigated by limiting length of user inputs.  Further modifer work will be done for version 2 to further address this

9. Miner Vulnerabilities - short term block timestamp is irrelevant to the application, is only used in a 'gross' time of insert, and not in any 'sensitive' operation.

10. Malicious Creator - contract does not handle funds, nor is owner other than just an actor in the contract, owners primary function is to allow credentialOrg into the app and unable to limit them (other than pausable).  I plan to further limit what the owner can do to include a switch turn on by Credentialling Orgs that allow the owner to act, otherwise the owner won't be able to.

11. Off Chain Safety - the contract does not rely on any external services to perform any actions. 

12. Cross-chain Replay Attacks - since contract is meant to be an off-chain enterprise solution makes this attack irrelevant.

13. Tx.Origin Problem - no use of Tx.origin.

14. Solidity Function Signatures and Fallback Data Collisions - contract does not receive ether, so no fallback is required.

15. Incorrect use of Cryptography - no use of cryptography in contracts.

16. Gas Limits - Being careful not to loop over that can grow as a result of user input.  Also, limiting user-supplied data length.

17. Stack Depth Exhaustion - no ether is transfered, only used to act on owner data, and not anothers.  Function variables are minimal by design.